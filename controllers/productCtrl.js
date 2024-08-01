import mongoose from 'mongoose';
import asynchandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from '../model/Category.js';

//@desc  create  new product
//@route POST /api/v1/products
//@access private/admin

export const createProductCtrl = asynchandler(async (req, res) => {
    const { name, description, category, sizes, colors
        , user, price, totalQty, brand
    } = req.body;
    const lowerCaseName = name.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();
    //Product exists
    const productExists = await Product.findOne({ name: lowerCaseName });
    if (productExists) {
        throw new Error("Product Already Exists");
    }
    //find the category
    const categoryFound = await Category.findOne({ name: lowerCaseCategory })
    if (!categoryFound) {
        throw new Error("Category Not Found Please Create Category First Or Check Category Name");
    }
    //create product
    const product = await Product.create({
        name: lowerCaseName,
        description,
        category: lowerCaseCategory,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand

    });
    //push the product into category
    categoryFound.products.push(product._id);
    //save category
    await categoryFound.save();
    res.json({
        status: "success",
        message: "Product created successfully",
        product
    });
})


//@desc  Get all products
//@route POST /api/v1/products
//@access public

export const getProductsCtrl = asynchandler(async (req, res) => {
    //Query
    let productQuery = Product.find();
    //filter by name
    if (req.query?.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: "i" }
        });
    }
    //filter by brand
    if (req.query?.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: "i" }
        });
    }
    //filter by Category
    if (req.query?.category) {
        productQuery = productQuery.find({
            category: req.query.category.toLowerCase()
        });
    }
    //filter by Color
    if (req.query?.color) {
        productQuery = productQuery.find({
            colors: { $regex: req.query.color, $options: "i" }
        });
    }
    //filter by size
    if (req.query?.size) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.size, $options: "i" }
        });
    }
    //filter by price range
    if (req.query?.price) {
        const pricerange = req.query.price.split("-");
        productQuery = productQuery.find({
            price: {
                $gte: pricerange[0],
                $lte: pricerange[1]
            }
        });
    }

    //pagination
    //Page
    const page = parseInt(req.query.page) || 1;
    //Limit
    const limit = parseInt(req.query.limit) || 10;
    //Start Index
    const startIndex = (page - 1) * limit;
    //End Index
    const endIndex = page * limit;
    //Total
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);
    //pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    //await the query
    const products = await productQuery;
    res.json({
        status: "success",
        total,
        resullt: products.length,
        pagination,
        message: "Products fetched successfully",
        products
    });
})

//@desc  Get single product
//@route POST /api/v1/products/:id
//@access public

export const getSingleProductCtrl = asynchandler(async (req, res) => {
    // console.log(req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new Error("Product not found");
    }
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product
    });
})

//@desc  Update  product
//@route POST /api/v1/products/:id/update
//@access Private Admin

export const updateProductCtrl = asynchandler(async (req, res) => {
    const { name, description, category, sizes, colors
        , user, price, totalQty, brand
    } = req.body;
    //update Product
    const lowerCaseName = name.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();
    const product = await Product.findByIdAndUpdate(req.params.id, {
        lowerCaseName,
        description,
        lowerCaseCategory,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand
    }, {
        new: true,
    });
    res.json({
        status: "success",
        message: "Product updated successfully",
        product
    });
})


//@desc  Delete  product
//@route DELETE /api/v1/products/:id/update
//@access Private Admin

export const deleteProductCtrl = asynchandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Product deleted successfully",
    });
})