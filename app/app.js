import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from 'dotenv';
dotenv.config();

//db connect
dbConnect();
const app = express();
export default app;