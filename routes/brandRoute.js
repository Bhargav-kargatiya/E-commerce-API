import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from "../controllers/brandCtrl.js";


const brandsRoutes = express.Router();
isLoggedin
productRoutes.post('/', isLoggedin, createBrandCtrl);
productRoutes.get('/', getAllBrandCtrl);
productRoutes.get('/:id', getSingleBrandCtrl);
productRoutes.put('/:id', isLoggedin, updateBrandCtrl);
productRoutes.delete('/:id', isLoggedin, deleteBrandCtrl);


export default brandsRoutes   