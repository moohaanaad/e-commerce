import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/appError.js"
import cloudinary from "../../utils/cloudniery.js"
import { messages } from "../../utils/constant/messages.js"
import { roles } from "../../utils/constant/enums.js"
import { hashPassword } from "../../utils/hashAndComare.js"
import { sendEmail } from "../../utils/sendEmail.js"
import { generateToken } from "../../utils/token.js"

//add user
export const addUser = async (req, res, next) => {
    //get data
    const { userName, email, phone, role, DOB, address } = req.body
    //cehck existence
    const userExist = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExist?.email == email) {
        return next(new AppError(messages.user.email, 409))
    }
    if (userExist?.phone == phone) {
        return next(new AppError(messages.user.phone, 409))
    }
    //prepare
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file, { folder: "users" })
        req.image = { secure_url, public_id }
    }
    const password = hashPassword({ password: 'e-commerce' })
    const user = User({
        userName,
        email,
        phone,
        password: password,
        role,
        DOB,
        address,
        image: req.image
    })
    //save in DB
    const createdUser = await user.save()
    if (!createdUser) {
        await cloudinary.api.delete_resources_by_prefix(`${secure_url}`)
        return next(new AppError(messages.user.failToCreate, 500))
    }
    // verify email
    const token = generateToken({ payload: { _id: createdUser._id } })
    sendEmail({
        to: email,
        subject: "verify account",
        html: `<p>
        to verify your account click 
        <a href="${req.protocol}://${req.headers.host}/auth/verify-account?token=${token}">link</a>
        </p>`
    })
    // response
    return res.status(201).json({ message: messages.user.createdSuccessfully, success: true, data: createdUser })
}

// update user
export const updateUser = async (req, res, next) => {
    //get data 
    const { userId } = req.params

    //check existence
    const userExist = await User.findOneAndUpdate(
        { _id: userId, $or: [{ role: roles.CUSTOMER }, { role: roles.SEELER }] },
        req.body,
        { new: true }
    )
    if (!userExist) {
        return next(new AppError(messages.user.notFound, 404))
    }
    // response 
    return res.status(200).json({ message: messages.user.updatedSuccessfully, success: true, data: userExist })
}

// get all users
export const allUser = async (req, res, next) => {
    const users = await User.find()
    return res.json({ message: 'done', success: true, daya: users })
}

//delete user
export const deleteUser = async (req, res, next) => {
    //get data 
    const { userId } = req.params
    //check exsitence
    const user = await User.findOneAndDelete({ _id: userId, $or: [{ role: roles.CUSTOMER }, { role: roles.SEELER }] })
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    return res.status(200).json({ message: messages.user.deletedSuccessfully, success: true, })
}