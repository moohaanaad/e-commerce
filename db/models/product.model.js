import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: mongoose.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
        required: true
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mainImage: {
        type: String,
        required: true
    },
    subImages: [String],
    price: {
        type: Number,
        min: 0,
        required: true
    },
    discount: {
        type: Number,
        min: 0,
    },
    size: [String],
    color: [String],
    stock: {
        type: Number,
        min: 0,
        default: 1
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
productSchema.virtual('finalPrice').get(function () {
    return this.price - (this.price * ((this.discount || 0) / 100))
})
productSchema.methods.inStock = function (quantity) {
    if (this.stock > quantity) {
        return true
    }
    return false
}
export const Product = /*model.Product ||*/ mongoose.model('Product', productSchema)