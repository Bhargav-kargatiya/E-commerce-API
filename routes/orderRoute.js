import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createOrderCtrl, getallOrdersCtrl, getOrderStatsCtrl, getSingleOrderCtrl, updateOrderCtrl } from "../controllers/orderCtrl.js";


const orderRoutes = express.Router();
isLoggedin
orderRoutes.post('/', isLoggedin, createOrderCtrl);
orderRoutes.get('/', isLoggedin, getallOrdersCtrl);
orderRoutes.get('/:id', isLoggedin, getSingleOrderCtrl);
orderRoutes.put('/update/:id', isLoggedin, updateOrderCtrl);
orderRoutes.get('/sales/stats', isLoggedin, getOrderStatsCtrl);


export default orderRoutes   