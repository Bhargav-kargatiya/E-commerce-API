import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

// @desc    Create new Color
// @route   Post /api/v1/colors
// @access  Private.admin

export const createColorCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    const colorFound = await Color.findOne({ name: lowerCaseName });
    if (colorFound) {
        throw new Error("Color Already Exists");
    }
    //Create Color
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId
    })

    //send response
    res.json({
        status: "success",
        message: "Color created successfully",
        color
    })
})

// @desc    Get all Colors
// @route   Get /api/v1/colors
// @access  Public
export const getAllColorCtrl = asyncHandler(async (req, res) => {
    const color = await Color.find();
    res.json({
        status: "success",
        message: "Color fetched successfully",
        color
    });
})

// @desc    Get Single colors
// @route   Get /api/v1/colors/:id
// @access  Public
export const getSingleColorCtrl = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id);
    res.json({
        status: "success",
        message: "Color fetched successfully",
        color
    });
})


//@desc  Update  color
//@route POST /api/v1/colors/:id
//@access Private Admin

export const updateColorCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    //update Product
    const color = await Color.findByIdAndUpdate(req.params.id, { name: lowerCaseName },
        {
            new: true,
        });
    res.json({
        status: "success",
        message: "Color updated successfully",
        color
    });
})


//@desc  Delete  color
//@route DELETE /api/v1/colors/:id
//@access Private Admin

export const deleteColorCtrl = asyncHandler(async (req, res) => {
    await Color.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Color deleted successfully",
    });
})