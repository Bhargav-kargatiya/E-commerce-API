import express from "express";
import { getUserProfileCtrl, loginUserCtrl, registerUserCtrl, updateUserShippingAddress } from "../controllers/userCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";

const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/profile', isLoggedin, getUserProfileCtrl);
userRoutes.put('/update/shipping', isLoggedin, updateUserShippingAddress);

export default userRoutes   