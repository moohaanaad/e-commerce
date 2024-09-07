import { Cart, Product } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"


export const addToCart = async (req, res, next) => {
    //get data
    const { productId, quantity } = req.body
    //check existence
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    //check stock
    if (!productExist.inStock(quantity)) {
        return next(new AppError(messages.product.stock, 400))
    }
    //check cart
    const userCart = await Cart.findOneAndUpdate(
        { user: req.userAuth._id, 'products.productId': productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
    )
    let data = userCart
    if (!userCart) {
        data = await Cart.findOneAndUpdate(
            { user: req.userAuth._id },
            { $push: { products: { productId, quantity } } },
            { new: true }
        )


    }
    return res.status(200).json({ success: true, data })
}

//delete cart 
// export const deleteCart = async (req, res, next) => {
//     //get data 
//     const { productId } = req.body
//     //check existence 
//     const productExist = await Product.findById(productId)
//     if (!productExist) {
//         return next(new AppError(messages.product.notFound, 404))
//     }
//     const deleteProduct = await Cart.findOneAndUpdate(
//         { user: req.userAuth._id, 'products.productId': productId },
//         { $addToSet:{'products.productId': productId} },
//         { new: true }
//     )
//     return res.status(200).json({ message: messages.product.deletedSuccessfully, success: true, data: deleteProduct })
// }
