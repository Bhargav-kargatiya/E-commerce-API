import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from 'dotenv';
import userRoutes from "../routes/usersRoute.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import productRoutes from "../routes/productRoute.js";
import brandsRoutes from "../routes/brandRoute.js";
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

//global error handler
app.use(notFound)
app.use(globalErrHandler)
export default app;