import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    comment:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        min:0,
        max:5
    }
})
export const Review = mongoose.model('Review',reviewSchema)
