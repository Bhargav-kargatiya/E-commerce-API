import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
// @desc    Create new Brand
// @route   Post /api/v1/categories
// @access  Private.admin

export const createBrandCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    const brandFound = await Brand.findOne({ name: lowerCaseName });
    if (brandFound) {
        throw new Error("Brand Already Exists");
    }
    //Create brand
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId
    })

    //send response
    res.json({
        status: "success",
        message: "Brand created successfully",
        brand
    })
})

// @desc    Get all Brands
// @route   Get /api/v1/brands
// @access  Public
export const getAllBrandCtrl = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    res.json({
        status: "success",
        message: "Brands fetched successfully",
        brands
    });
})

// @desc    Get Single brand
// @route   Get /api/v1/brands/:id
// @access  Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand
    });
})


//@desc  Update  brand
//@route POST /api/v1/brands/:id
//@access Private Admin

export const updateBrandCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    //update Product
    const brand = await Brand.findByIdAndUpdate(req.params.id, { name: lowerCaseName },
        {
            new: true,
        });
    res.json({
        status: "success",
        message: "Brand updated successfully",
        brand
    });
})


//@desc  Delete  brand
//@route DELETE /api/v1/brands/:id
//@access Private Admin

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });
})