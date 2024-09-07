import mongoose, { Schema } from "mongoose";

// schema
const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },//'ahmed',
        slug: { type: String, required: true, unique: true, trim: true },
        image: Object,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

categorySchema.virtual("subcategories", {
    ref: 'SubCategory',
    foreignField: 'category',
    localField: '_id'
})

// model
export const Category =  /**mongoose.model.Category ||*/ mongoose.model('Category', categorySchema)