import mongoose from "mongoose";
import path from "path"
import dotenv from "dotenv";
import { roles, status } from "../../src/utils/constant/enums.js";
dotenv.config({ path: path.resolve("./config/.env") })
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: Object,
        enum: Object.values(roles),
        default: roles.CUSTOMER
    },
    status: {
        type: Object,
        enum: Object.values(status),
        default: status.PENDING
    },
    isActive: {
        type: Boolean,
        default: false
    },
    image: {
        type: Object,
        default: {
            secure_url: process.env.SECURE_URL,
            public_id: process.env.PUBLIC_ID
        }
    },
    DOB: Date,
    address: [
        {
            street: String,
            city: String,
            phone: String
        }
    ],
    wishlist:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Product"
        }
    ],
    OTP:Number,
    expireDateOTP:Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export const User = /*model.User ||*/ mongoose.model('User', userSchema)