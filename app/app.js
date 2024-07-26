import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from 'dotenv';
import userRoutes from "../routes/usersRoute.js";
dotenv.config();

//db connect
dbConnect();
const app = express();

//pass incoming data
app.use(express.json())
//routes
app.use('/', userRoutes)
export default app;