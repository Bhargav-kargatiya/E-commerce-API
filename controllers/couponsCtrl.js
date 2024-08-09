import Coupon from "../model/Coupon.js";
import asyncHandler from "express-async-handler";


//@desc create new coupon
//@route POST /api/v1/coupons
//@access private/admin

export const createCouponCtrl = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    //check if admin
    //check if coupon already exists
    const couponsExists = await Coupon.findOne({
        code,
    })
    if (couponsExists) {
        throw new Error("Coupon already exists")
    }
    //check if discount is a number
    if (isNaN(discount)) {
        throw new Error("Discount value must be a number")
    }
    //create coupon
    const coupon = await Coupon.create({
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId
    })
    res.json({
        status: "success",
        message: "Coupon created",
        coupon
    })
})

//@desc get all coupons
//@route GET /api/v1/coupons
//@access private/admin

export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.json({
        status: "success",
        message: "Coupons fetched successfully",
        coupons
    })
})

//@desc get single coupon
//@route GET /api/v1/coupons/:id
//@access private/admin
export const getSingleCouponCtrl = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    res.json({
        status: "success",
        message: "Coupon fetched successfully",
        coupon
    })
})


//@desc update coupon
//@route PUT /api/v1/coupons/:id
//@access private/admin

export const updateCouponCtrl = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body
    //check if coupon exists
    const couponExists = await Coupon.findById(req.params.id);
    if (!couponExists) {
        throw new Error("Coupon not found")
    }
    const coupon = await Coupon.findByIdAndUpdate(req.params.id,
        {
            code: code?.toUpperCase(),
            startDate,
            endDate,
            discount,
        },
        {
            new: true,
        }
    );
    res.json({
        status: "success",
        message: "Coupon updated successfully",
        coupon
    })
})

//@desc delete coupon
//@route DELETE /api/v1/coupons/:id
//@access private/admin

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Coupon deleted successfully",
        coupon
    })
})