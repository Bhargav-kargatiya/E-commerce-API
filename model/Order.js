import mongoose from "mongoose";

// Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000)
const schema = mongoose.Schema;
const OrderSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [{
        type: Object,
        required: true
    }],
    shippingAddress: {
        type: Object,
        required: true
    },
    orderNumber: {
        type: String,
        default: randomTxt + randomNumbers
    },
    paymentStatus: {
        type: String,
        default: "Not Paid"
    },
    paymentMethod: {
        type: String,
        default: "Not Specified"
    },
    totalPrice: {
        type: Number,
        default: 0.0
    },
    currency: {
        type: String,
        default: "Not Specified"
    },
    //for Admin 
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Processing"]
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
})

//Compile the schema into a model
const Order = mongoose.model("Order", OrderSchema);
export default Order
