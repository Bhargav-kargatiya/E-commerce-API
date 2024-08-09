import express from "express";
import { createProductCtrl, deleteProductCtrl, getProductsCtrl, getSingleProductCtrl, updateProductCtrl } from "../controllers/productCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";


const productRoutes = express.Router();
isLoggedin
productRoutes.post('/', isLoggedin, isAdmin, upload.array('files'), createProductCtrl);
productRoutes.get('/', getProductsCtrl);
productRoutes.get('/:id', getSingleProductCtrl);
productRoutes.put('/:id', isLoggedin, isAdmin, updateProductCtrl);
productRoutes.delete('/:id/delete', isLoggedin, isAdmin, deleteProductCtrl);


export default productRoutes   