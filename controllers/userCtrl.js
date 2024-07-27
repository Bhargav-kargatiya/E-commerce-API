import User from "../model/User.js";
import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler";
import generateToke from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc    Regester user
// @route   POST /api/v1/users/register
// @access  Private/Admin
export const registerUserCtrl = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body

    //Check user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        //throw
        throw new Error("User already exists");

    }
    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    //create the user
    const user = await User.create({
        fullname,
        email,
        password: hashedPassword
    })

    res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: user
    })
})

// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
export const loginUserCtrl = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
        res.json({
            status: "success",
            message: "User logged in successfully",
            data: userFound,
            token: generateToke(userFound?._id),
        })
    } else {
        throw new Error("Invalid login credentials");
    }
})

// @desc    Get user Profile
// @route   POST /api/v1/users/prfile
// @access  Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
    //get token from header
    const token = getTokenFromHeader(req)
    //verify the token
    const verified = verifyToken(token)
    res.json({
        status: "success",
        message: "User profile fetched successfully",
        data: req.user
    })
})

