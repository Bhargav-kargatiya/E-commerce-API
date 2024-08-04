import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
//Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//@desc create orders
//@route POST /api/v1/orders
//@access private
export const createOrderCtrl = asyncHandler(async (req, res) => {

    //1. Get the payload(customer, orderItems, shipppingAddress, totalPrice)
    const { orderItems, shippingAddress, totalPrice } = req.body;


    //2. Find the  user
    const user = await User.findById(req.userAuthId);
    //check if user have shiiping addrss
    if (!user?.hasShippingAddress) {
        throw new Error("Please add your shipping address");
    }


    //3. Check if order is not empty
    if (orderItems?.length <= 0) {
        throw new Error("No Order Items");
    }

    //Place/create the order-save into db
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice
    })

    //Update the produr quantity
    const products = await Product.find({ _id: { $in: orderItems } });

    orderItems?.map(async (item) => {
        const product = products?.find((p) => p._id.toString() === item?._id.toString());
        if (product) {
            product.totalSold += item.qty;
        }
        await product?.save();
    });

    //Push order into user
    user.orders.push(order?._id);
    await user.save();
    //Make payment (stripe)

    //Convert order items to have same structure that stripe expects
    const convertedOrder = orderItems?.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    description: item.description,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.qty,
        }
    })
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrder,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    })
    res.send({ url: session.url });
    //Implement Payment webhook

    //Update the  user order
    res.send({
        success: true,
        message: "Order Placed",
        order
    })
})
