import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponsCtrl, getSingleCouponCtrl, updateCouponCtrl } from "../controllers/couponsCtrl.js";




const colorsRoutes = express.Router();
isLoggedin
colorsRoutes.post('/', isLoggedin, createCouponCtrl);
colorsRoutes.get('/', isLoggedin, getAllCouponsCtrl);
colorsRoutes.get('/:id', isLoggedin, getSingleCouponCtrl);
colorsRoutes.put('/update/:id', isLoggedin, updateCouponCtrl);
colorsRoutes.put('/delete/:id', isLoggedin, deleteCouponCtrl);



export default colorsRoutes   