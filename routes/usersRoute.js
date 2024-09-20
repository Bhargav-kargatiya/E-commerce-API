import express from "express";
import { forgotPasswordCtrl, getUserProfileCtrl, loginUserCtrl, registerUserCtrl, resetPasswordCtrl, updateUserShippingAddress } from "../controllers/userCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";

const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/profile', getUserProfileCtrl);
userRoutes.put('/update/shipping', isLoggedin, updateUserShippingAddress);
userRoutes.post('/forgot-password', isLoggedin, forgotPasswordCtrl);
userRoutes.get('/reset-password/:token', resetPasswordCtrl);

export default userRoutes   