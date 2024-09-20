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
import { Redis } from "ioredis";
import { rateLimiter } from "../middlewares/Ratelimiter.js";

// Use environment variables for Redis connection
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

export const Client = new Redis({
    host: redisHost,
    port: redisPort,
});
dotenv.config();
//db connect
dbConnect();
const app = express();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

app.use('/api/v1/users', rateLimiter, userRoutes)
app.use('/api/v1/product', rateLimiter, productRoutes)
app.use('/api/v1/categories', rateLimiter, categoriesRouter)
app.use('/api/v1/brands', rateLimiter, brandsRoutes)
app.use('/api/v1/colors', rateLimiter, colorsRoutes)
app.use('/api/v1/reviews', rateLimiter, reviewsRoutes)
app.use('/api/v1/orders', rateLimiter, orderRoutes)
app.use('/api/v1/coupons', rateLimiter, couponRoutes)

//global error handler
app.use(notFound)
app.use(globalErrHandler)
export default app;