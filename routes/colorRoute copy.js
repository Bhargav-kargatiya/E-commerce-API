import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createColorCtrl, getAllColorCtrl, getSingleColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/colorsCtrl.js";



const colorsRoutes = express.Router();
isLoggedin
colorsRoutes.post('/', isLoggedin, createColorCtrl);
colorsRoutes.get('/', getAllColorCtrl);
colorsRoutes.get('/:id', getSingleColorCtrl);
colorsRoutes.put('/:id', isLoggedin, updateColorCtrl);
colorsRoutes.delete('/:id', isLoggedin, deleteColorCtrl);


export default colorsRoutes   