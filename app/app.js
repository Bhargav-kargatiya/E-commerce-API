import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from 'dotenv';
import userRoutes from "../routes/usersRoute.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import productRoutes from "../routes/productRoute.js";
dotenv.config();

//db connect
dbConnect();
const app = express();

//pass incoming data
app.use(express.json())
//routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/product', productRoutes)

//global error handler
app.use(notFound)
app.use(globalErrHandler)
export default app;