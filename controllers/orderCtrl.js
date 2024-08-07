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
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    })
    res.send({ url: session.url });
    //Implement Payment webhook
})

//@desc get all orders
//@route GET /api/v1/orders
//@access private
export const getallOrdersCtrl = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.json(
        {
            success: true,
            message: "Orders fetched successfully",
            orders
        });
})


//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin
export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
    //get the is form request
    const { id } = req.params;
    const order = await Order.findById(id);
    res.json({ success: true, message: "Order fetched successfully", order })

})

//@desc update order to "Pending", "Shipped", "Delivered", "Cancelled", "Processing"
//@route PUT /api/v1/orders/update/:id
//@access private/admin
export const updateOrderCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, {
        status: req.body.status
    }, {
        new: true,
    });
    res.json({ success: true, message: "Order updated successfully", order })
})



