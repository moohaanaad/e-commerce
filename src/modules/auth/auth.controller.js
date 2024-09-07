import { Cart } from "../../../db/index.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { status } from "../../utils/constant/enums.js"
import { comparePassword, hashPassword } from "../../utils/hashAndComare.js"
import { sendEmail } from "../../utils/sendEmail.js"
import { generateToken, verifyToken } from "../../utils/token.js"
import { generateOTP } from "../../utils/OTP.js"

//signup
export const signup = async (req, res, next) => {
    //get data
    let { userName, email, password, phone, address, DOB } = req.body
    //check existence
    const userExist = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExist?.email == email) {
        return next(new AppError(messages.user.email, 409))
    }
    if (userExist?.phone == phone) {
        return next(new AppError(messages.user.phone, 409))
    }
    //prepare data
    password = hashPassword({ password })
    const user = User({
        userName,
        email,
        password,
        phone,
        address,
        DOB
    })
    //save user in db
    const createdUser = await user.save()
    if (!createdUser) {
        return next(AppError(messages.user.failToCreate, 500))
    }
    //send email
    const token = generateToken({ payload: { _id: createdUser._id } })
    await sendEmail({
        to: email,
        subject: "verify account",
        html: `<p>
        to verify your account click 
        <a href="${req.protocol}://${req.headers.host}/auth/verify-account?token=${token}">link</a>
        </p>`
    })
    //response 
    res.status(201).json({ message: messages.user.createdSuccessfully, token, sccuess: true })
}

//verify account
export const verifyAccount = async (req, res, next) => {
    const { token } = req.query
    // check existence
    const decode = verifyToken({ token })
    const user = await User.findByIdAndUpdate(decode._id, { status: status.VERIFIED }, { new: true })
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    await Cart.create({ user: user._id, products: [] })
    return res.status(200).json({ message: messages.user.verifiedSuccessfully })
}

//login
export const login = async (req, res, next) => {
    //get data
    const { email, password, phone } = req.body
    //check existence
    const userExist = await User.findOne({ $or: [{ email }, { phone }], status: status.VERIFIED })
    if (!userExist) {
        return next(new AppError(messages.user.notFound, 404))
    }
    const checkpassword = comparePassword({ password, hashedPasswrod: userExist.password })
    if (!checkpassword) {
        return next(new AppError(messages.user.notFound, 404))
    }
    //make user active
    userExist.isActive = true
    await userExist.save()
    //send token 
    const token = generateToken({ payload: { _id: userExist._id } })
    return res.status(200).json({ message: messages.user.login, success: true, token })

}

//logout
export const logout = async (req, res, next) => {
    //get data
    const { _id } = req.userAuth
    const user = await User.findByIdAndUpdate(_id, { isActive: false })
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    return res.status(200).json({ message: "logout successfully", success: true })
}

//forget password
export const frogetPassword = async (req, res, next) => {
    //get data 
    const { email } = req.body
    //check existence
    const userExist = await User.findOne({ email })
    if (!userExist) {
        return next(new AppError(messages.user.notFound, 404))
    }
    if (userExist.OTP && userExist.expireDateOTP > Date.now()) {
        return next(new AppError(messages.user.hasOTP, 400))
    }
    //create OTP
    const otp = generateOTP()
    //update user
    userExist.OTP = otp
    userExist.expireDateOTP = Date.now() + 15 * 60 * 1000
    await userExist.save()
    await sendEmail({ to: email, subject: "OTP", html: `<h1>your OTP is : ${otp}</h1>` })
    //response
    return res.status(200).json({ message: messages.user.OTP, success: true })
}

//reset password 
export const resetPassword = async (req, res, next) => {
    //get data 
    const { email, OTP, password } = req.body
    //check existence
    const userExist = await User.findOne({ email })
    if (!userExist) {
        return next(new AppError(messages.user.notFound, 404))
    }
    if (OTP !== userExist.OTP) {
        return next(new AppError(messages.user.invalidOTP, 404))
    }
    //hash password
    const hashedPasswrod = hashPassword({ password })
    //update data
    userExist.password = hashedPasswrod
    userExist.OTP = undefined
    userExist.expireDateOTP = undefined
    await userExist.save()
    //respose
    return res.status(200).json({ message: messages.user.updatedSuccessfully, success: true })
}