import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createCategoryCtrl, getAllCategoryCtrl, getSingleCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } from "../controllers/categoriesCtrl.js";
import upload from "../config/fileUpload.js";


const categoriesRouter = express.Router();
isLoggedin
categoriesRouter.post('/', isLoggedin, upload.single('file'), createCategoryCtrl);
categoriesRouter.get('/', getAllCategoryCtrl);
categoriesRouter.get('/:id', getSingleCategoryCtrl);
categoriesRouter.delete('/:id', isLoggedin, deleteCategoryCtrl);
categoriesRouter.put('/:id', isLoggedin, updateCategoryCtrl);



export default categoriesRouter   