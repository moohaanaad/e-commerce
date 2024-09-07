import { Product, Review } from "../../../db/index.js"
import { AppError } from "../../utils/appError"
import { messages } from "../../utils/constant/messages.js"

export const addReview = async (req, res, next) => {
    //get data
    const { comment, rate } = req.body
    const { productId } = req.query
    //check existence
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    const reviewExist = await Review.findOneAndUpdate({ user: req.userAuth._id, product: productId },
        { comment, rate }, { new: true }
    )
    let message = messages.review.updatedSuccessfully 
    let data = reviewExist
    if(!reviewExist){
        const review = Review({
            user:req.userAuth._id,
            product:productId,
            comment,
            rate
        })
        const createReview = await review.save()
        if(!createReview){
            return next(new AppError(messages.review.failToCreate,500))
        }
        message = messages.review.createdSuccessfully
        data = createReview
    }
    return res.states(200).json(message,data)
}