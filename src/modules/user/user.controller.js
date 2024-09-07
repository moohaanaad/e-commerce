import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { comparePassword, hashPassword } from "../../utils/hashAndComare.js"


//get user data
export const getUser = async (req, res, next) => {
    //get data
    const { _id } = req.userAuth
    const user = await User.findById(_id)
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    return res.status(200).json({ data: user, success: true })
}
//delete account
export const deleteUser = async (req, res, next) => {
    // get data 
    const { _id } = req.userAuth
    const user = await User.findByIdAndDelete(_id)
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    return res.status(200).json({ message: messages.user.deletedSuccessfully, success: true })
}

//change password
export const changePassword = async (req, res, next) => {
    // get data
    const { oldPassword, password } = req.body
    //check password
    const match = comparePassword({ password: oldPassword, hashedPasswrod: req.userAuth.password })
    if (!match) {
        return next(new AppError(messages.user.invalidcrendential))
    }
    //hash password
    const hashed = hashPassword({ password })
    //save update
    const user = await User.updateOne({ _id: req.userAuth._id }, { password: hashed })
    //response
    return res.status(200).json({ message: messages.user.updatedSuccessfully, success: true })
}

//update user
export const updateUser = async (req, res, next) => {
    //get data
    const { userName, phone, DOB } = req.body
    let user = {}
    if (userName) {
        user.userName = userName
    }
    if (phone) {
        user.phone = phone
    }
    if (DOB) {
        user.DOB = DOB
    }
    const updatedUser = await User.findByIdAndUpdate(req.userAuth._id, user, { new: true })
    if (!updateUser) {
        return next(new AppError(messages.user.failToCreate, 500))
    }
    return res.status(200).json({ message: messages.user.updatedSuccessfully, success: true, data: updatedUser })
}