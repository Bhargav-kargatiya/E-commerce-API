import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponsCtrl, getSingleCouponCtrl, updateCouponCtrl } from "../controllers/couponsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";




const colorsRoutes = express.Router();
isLoggedin
colorsRoutes.post('/', isLoggedin, isAdmin, createCouponCtrl);
colorsRoutes.get('/', isLoggedin, getAllCouponsCtrl);
colorsRoutes.get('/:id', getSingleCouponCtrl);
colorsRoutes.put('/update/:id', isLoggedin, isAdmin, updateCouponCtrl);
colorsRoutes.put('/delete/:id', isLoggedin, isAdmin, deleteCouponCtrl);



export default colorsRoutes   