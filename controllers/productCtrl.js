import asynchandler from "express-async-handler";
import Product from "../model/Product.js";
//@desc  create  new product
//@route POST /api/v1/products
//@access private/admin

export const createProductCtrl = asynchandler(async (req, res) => {
    const { name, description, category, sizes, colors
        , user, price, totalQty, brand
    } = req.body;
    //Product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product Already Exists");
    }
    //create product
    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand

    });
    //push the product into category

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