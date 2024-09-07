import { model, Schema } from "mongoose";

// schema
const subCategorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },//'ahmed',
        slug: { type: String, required: true, unique: true, trim: true },
        image: String,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        }
    }, { timestamps: true }
)
// model
export const SubCategory = /*model.SubCategory ||*/ model('SubCategory', subCategorySchema)