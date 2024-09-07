import mongoose from "mongoose";
import { orderStatus, payment } from "../../src/utils/constant/enums.js";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
        title: String,
        itemPrice: Number,
        quantity: Number,
        finalPrice: Number,
    }],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    coupon: {
        couponId: {
            type: mongoose.Types.ObjectId,
            ref: "Coupon"
        },
        code: String,
        discount: Number
    },
    status: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.PLACED
    },
    payment: {
        type: String,
        enum: Object.values(payment),
        required: true
    },
    orderPrice: Number,
    finalPrice: Number
},
    { timestamps: true }
)
export const Order = mongoose.model("Order", orderSchema)