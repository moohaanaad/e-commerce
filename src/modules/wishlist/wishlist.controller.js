import { Product } from "../../../db/models/product.model.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"


export const addWishlist = async (req, res, next) => {
    //get data
    const { productId } = req.body
    const { _id } = req.userAuth
    // check existence 
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    const user = await User.findByIdAndUpdate(_id, { $addToSet: { wishlist: productId } }, { new: true }).select("wishlist")
    if (!user) {
        return next(new AppError(messages.wishlist.failToCreate, 500))
    }
    return res.status(200).json({ message: messages.wishlist.updatedSuccessfully, sccuess: true, data: user })
}
//delete
export const delelteWishlist = async (req, res, next) => {
    //get data
    const { productId } = req.body
    const { _id } = req.userAuth
    // check existence 
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    const user = await User.findByIdAndUpdate(_id, { $pull: { wishlist: productId } }, { new: true }).select("wishlist")
    if (!user) {
        return next(new AppError(messages.wishlist.failToCreate, 500))
    }
    return res.status(200).json({ message: messages.wishlist.deletedSuccessfully, sccuess: true, data: user })
}
//get
export const allWishlists = async (req, res, next) => {
    //get data
    const { _id } = req.userAuth
    const user = await User.findById(_id).populate({ path: "wishlist" }).select("wishlist")
    if (!user) {
        return next(new AppError(messages.wishlist.notFound, 500))
    }
    return res.status(200).json({ message: "done", sccuess: true, data: user })
}