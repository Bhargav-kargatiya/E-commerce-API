import express from "express";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import { createReviewCtrl } from "../controllers/reviewCtrl.js";



const reviewsRoutes = express.Router();
isLoggedin
reviewsRoutes.post('/:productId', isLoggedin, createReviewCtrl);

export default reviewsRoutes   