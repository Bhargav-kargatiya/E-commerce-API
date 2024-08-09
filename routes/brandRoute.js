import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from "../controllers/brandCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";


const brandsRoutes = express.Router();
isLoggedin
brandsRoutes.post('/', isLoggedin, isAdmin, createBrandCtrl);
brandsRoutes.get('/', getAllBrandCtrl);
brandsRoutes.get('/:id', getSingleBrandCtrl);
brandsRoutes.put('/:id', isLoggedin, isAdmin, updateBrandCtrl);
brandsRoutes.delete('/:id', isLoggedin, isAdmin, deleteBrandCtrl);


export default brandsRoutes   