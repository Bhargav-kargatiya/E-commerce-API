import express from "express";
import { createProductCtrl, deleteProductCtrl, getProductsCtrl, getSingleProductCtrl, updateProductCtrl } from "../controllers/productCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";


const productRoutes = express.Router();
isLoggedin
productRoutes.post('/', isLoggedin, createProductCtrl);
productRoutes.get('/', getProductsCtrl);
productRoutes.get('/:id', getSingleProductCtrl);
productRoutes.put('/:id', isLoggedin, updateProductCtrl);
productRoutes.delete('/:id/delete', isLoggedin, deleteProductCtrl);


export default productRoutes   