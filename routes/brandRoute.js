import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from "../controllers/brandCtrl.js";


const brandsRoutes = express.Router();
isLoggedin
brandsRoutes.post('/', isLoggedin, createBrandCtrl);
brandsRoutes.get('/', getAllBrandCtrl);
brandsRoutes.get('/:id', getSingleBrandCtrl);
brandsRoutes.put('/:id', isLoggedin, updateBrandCtrl);
brandsRoutes.delete('/:id', isLoggedin, deleteBrandCtrl);


export default brandsRoutes   