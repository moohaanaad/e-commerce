import joi from "joi"
import { AppError } from "../utils/appError.js"
import { couponTypes } from "../utils/constant/enums.js"
export const generalFields = {
    name: joi.string(),
    email: joi.string().email(),
    phone: joi.string(),
    password: joi.string(),
    rePassword: joi.string().valid(joi.ref('password')),
    objectId: joi.string().hex().length(24),
    price: joi.number().min(0),
    DOB: joi.date(),
    address: joi.array(),
    role: joi.string(),
    comment: joi.string(),
    rate: joi.number().min(0).max(5),
    code: joi.string().length(6),
    couponAmount: joi.number().min(1),
    couponTypes: joi.string().valid(...Object.values(couponTypes)),
    fromDate: joi.date().greater(Date.now() - (24 * 60 * 60 * 1000)),
    toDate:joi.date().greater(joi.ref("fromDate")),
    OTP:joi.number()

}
export const isValid = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.query, ...req.params }
        const { error } = schema.validate(data, { abortEarly: false })
        if (error) {
            const errArr = []
            error.details.forEach(err => errArr.push(err.message));
            return next(new AppError(errArr, 400))
        }
        next()
    }
}