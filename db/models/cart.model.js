import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    products: [
        {
            productId: { type: mongoose.Types.ObjectId, ref: "Product" },
            quantity: Number
        }
    ]

}, {
    timestamps: true
})

export const Cart = mongoose.model('Cart', cartSchema)