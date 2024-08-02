import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";
// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
    const { message, rating } = req.body;
    //1. Find the Product 
    const { productId } = req.params;
    const productFound = await Product.findById(productId).populate("reviews");
    if (!productFound) {
        throw new Error("Product Not Found");
    }

    //check if user already reviewed this product
    const hasReviewed = productFound?.reviews?.find((review) => {
        return review?.user?.toString() === req?.userAuthId?.toString()
    })
    if (hasReviewed) {
        throw new Error("You have already reviewed this product");
    }

    //2. Create the review
    const review = await Review.create({
        message,
        rating,
        product: productFound._id,
        user: req.userAuthId
    });
    //3. Add review to product
    productFound.reviews.push(review._id);
    await productFound.save();

    res.json({
        status: "success",
        message: "Review created successfully"
    })
})
