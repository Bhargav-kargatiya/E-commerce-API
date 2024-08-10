import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from 'dotenv';
import path from "path";
import userRoutes from "../routes/usersRoute.js";
import stripe from "stripe";
import categoriesRouter from "../routes/categoriesRouter.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import productRoutes from "../routes/productRoute.js";
import brandsRoutes from "../routes/brandRoute.js";
import colorsRoutes from "../routes/colorRoute copy.js";
import reviewsRoutes from "../routes/reviewRoute.js";
import orderRoutes from "../routes/orderRoute.js";
import Order from "../model/Order.js";
import couponRoutes from "../routes/couponRoute.js";
dotenv.config();

//db connect
dbConnect();
const app = express();

// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_09ce2abe04a3b8c836985565279501e0066e8c427d33036085149b62e19b56bc";

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log("event");

    } catch (err) {
        console.log(err.message);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        //update the order 
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total / 100;
        const currency = session.currency;
        console.log(orderId, paymentStatus, paymentMethod, totalAmount, currency);


        //update the order
        const order = await Order.findByIdAndUpdate(
            JSON.parse(orderId), {
            totalPrice: totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            currency
        }, {
            new: true
        });
        console.log(order);
        //save order


    } else {
        return
    }

    // // Handle the event
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntentSucceeded = event.data.object;
    //         // Then define and call a function to handle the event payment_intent.succeeded
    //         break;
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});


//pass incoming data
app.use(express.json())

//server static files
app.use(express.static("public"))

//routes
//homw route
app.get('/', (req, res) => {
    res.sendFile(path.join("public", '../public/index.html'))
})

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/brands', brandsRoutes)
app.use('/api/v1/colors', colorsRoutes)
app.use('/api/v1/reviews', reviewsRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/coupons', couponRoutes)

//global error handler
app.use(notFound)
app.use(globalErrHandler)
export default app;