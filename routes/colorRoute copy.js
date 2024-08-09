import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createColorCtrl, getAllColorCtrl, getSingleColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/colorsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";



const colorsRoutes = express.Router();
isLoggedin
colorsRoutes.post('/', isLoggedin, isAdmin, createColorCtrl);
colorsRoutes.get('/', getAllColorCtrl);
colorsRoutes.get('/:id', getSingleColorCtrl);
colorsRoutes.put('/:id', isLoggedin, isAdmin, updateColorCtrl);
colorsRoutes.delete('/:id', isLoggedin, isAdmin, deleteColorCtrl);


export default colorsRoutes   