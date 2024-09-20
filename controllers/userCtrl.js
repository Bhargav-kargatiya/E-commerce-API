import User from "../model/User.js";
import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler";
import generateToke from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken"
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
    if (!email || !password) {
        const error = new Error("Please add email and password");
        error.statusCode = 400; // Set the custom status code
        throw error; // Throw the error with the attached status code
    }
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
    //find the user
    const user = await User.findById(req.userAuthId).populate("orders")

    if (!user) {
        throw new Error("User not found");
    }
    res.json({
        status: "success",
        message: "User profile fetched successfully",
        data: user
    })

})
// @desc    Update user shipping address
// @route   PUT /api/v1/users/update/shipping
// @access  Private
export const updateUserShippingAddress = asyncHandler(async (req, res) => {
    const { firstName, lastName, address, city, postalCode, province, country, phone } = req.body
    const user = await User.findByIdAndUpdate(req.userAuthId,
        {
            shippingAddress: {
                firstName, lastName, address, city, postalCode, province, country, phone
            },
            hasShippingAddress: true
        },
        {
            new: true
        })
    res.json({
        status: "success",
        message: "User shipping address updated successfully",
        data: user
    })
});

// @desc    Forgot Password
// @route   POST /api/v1/users/forgot-password
// @access  Public
export const forgotPasswordCtrl = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found with this email");
    }

    // Create a JWT token for password reset
    const resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // You can use a separate secret for password reset if needed
        { expiresIn: '10m' } // Token will expire in 10 minutes
    );

    // Generate reset URL with the JWT token
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Click this link to reset it: ${resetURL}`;

    try {
        // Send the email
        await sendEmail({
            email: user.email,
            subject: 'Your Password Reset Token (valid for 10 minutes)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        throw new Error("There was an error sending the email. Try again later.");
    }
});


// @desc    Reset Password
// @route   PUT /api/v1/users/reset-password/:token
// @access  Public
export const resetPasswordCtrl = asyncHandler(async (req, res) => {
    const { token } = req.params;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        // Find the user by the decoded ID
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Set the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // Save the updated user
        await user.save();

        // Send response
        res.status(200).json({
            status: 'success',
            message: 'Password reset successful!',
            token: generateToke(user._id), // Log the user in after resetting password
        });
    } catch (err) {
        // Handle invalid or expired token
        throw new Error("Token is invalid or has expired");
    }
});



