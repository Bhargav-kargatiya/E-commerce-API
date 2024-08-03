import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from 'dotenv';
import userRoutes from "../routes/usersRoute.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import productRoutes from "../routes/productRoute.js";
import brandsRoutes from "../routes/brandRoute.js";
import colorsRoutes from "../routes/colorRoute copy.js";
import reviewsRoutes from "../routes/reviewRoute.js";
import orderRoutes from "../routes/orderRoute.js";
dotenv.config();

//db connect
dbConnect();
const app = express();

//pass incoming data
app.use(express.json())
//routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/brands', brandsRoutes)
app.use('/api/v1/colors', colorsRoutes)
app.use('/api/v1/reviews', reviewsRoutes)
app.use('/api/v1/orders', orderRoutes)

//global error handler
app.use(notFound)
app.use(globalErrHandler)
export default app;