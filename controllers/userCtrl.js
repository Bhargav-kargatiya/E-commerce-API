import User from "../model/User.js";
import bcrypt from "bcryptjs"
// @desc    Regester user
// @route   POST /api/v1/users/register
// @access  Private/Admin
export const registerUserCtrl = async (req, res) => {
    const { fullname, email, password } = req.body

    //Check user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        //throw
        res.json({
            status: "failed",
            message: "User already exists"
        })

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
}

// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
export const loginUserCtrl = async (req, res) => {

    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
        res.json({
            status: "success",
            message: "User logged in successfully",
            data: userFound
        })
    } else {
        res.json({
            status: "failed",
            message: "Invalid login credentials"
        })
    }
}