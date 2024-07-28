import express from "express";
import { createProductCtrl, getProductsCtrl } from "../controllers/productCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";


const productRoutes = express.Router();
isLoggedin
productRoutes.post('/', isLoggedin, createProductCtrl);
productRoutes.get('/', getProductsCtrl);


export default productRoutes   