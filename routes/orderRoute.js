import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createOrderCtrl } from "../controllers/orderCtrl.js";


const orderRoutes = express.Router();
isLoggedin
orderRoutes.post('/', isLoggedin, createOrderCtrl);
// orderRoutes.get('/', getProductsCtrl);
// orderRoutes.get('/:id', getSingleProductCtrl);
// orderRoutes.put('/:id', isLoggedin, updateProductCtrl);
// orderRoutes.delete('/:id/delete', isLoggedin, deleteProductCtrl);


export default orderRoutes   