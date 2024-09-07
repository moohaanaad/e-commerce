import mongoose from "mongoose";
import { couponTypes } from "../../src/utils/constant/enums.js"

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    couponAmount: {
        type: Number,
        min: 1,
        required:true
    },
    couponType: {
        type: String,
        enum: Object.values(couponTypes),
        required:true
    },
    fromDate: { type: Date, default: Date.now() },
    toDate: { type: Date, default: Date.now() + (24 * 60 * 60 * 1000) },
    assignedUsers: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "User"
            },
            maxUse: { type: Number, default: 5, max: 5 }
        }
    ],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})

export const Coupon = mongoose.model('Coupon', couponSchema) 