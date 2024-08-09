import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";
// @desc    Create new category
// @route   Post /api/v1/categories
// @access  Private.admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {


    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    const categoryFound = await Category.findOne({ name: lowerCaseName });
    if (categoryFound) {
        throw new Error("Category Already Exists");
    }
    //Create category
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req?.file?.path
    })

    //send response
    res.json({
        status: "success",
        message: "Category created successfully",
        category
    })
})

// @desc    Get all category
// @route   Get /api/v1/categories
// @access  Public
export const getAllCategoryCtrl = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({
        status: "success",
        message: "Categories fetched successfully",
        categories
    });
})

// @desc    Get Single category
// @route   Get /api/v1/categories
// @access  Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.json({
        status: "success",
        message: "Category fetched successfully",
        category
    });
})


//@desc  Update  Category
//@route POST /api/v1/categories/:id/update
//@access Private Admin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    //update Product
    const category = await Category.findByIdAndUpdate(req.params.id, {
        lowerCaseName,

    }, {
        new: true,
    });
    res.json({
        status: "success",
        message: "Category updated successfully",
        category
    });
})


//@desc  Delete  Category
//@route DELETE /api/v1/categories/:id/update
//@access Private Admin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Category deleted successfully",
    });
})