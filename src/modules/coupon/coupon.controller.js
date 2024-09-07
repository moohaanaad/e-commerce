import { Coupon } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { couponTypes } from "../../utils/constant/enums.js"
import { messages } from "../../utils/constant/messages.js"

//create coupon 
export const createCoupon = async (req, res, next) => {
    //get data 
    const { code, couponAmount, couponType, fromDate, toDate } = req.body
    //check existence 
    const couponExist = await Coupon.findOne({ code })
    if (couponExist) {
        return next(new AppError(messages.coupon.notFound, 400))
    }
    if (couponType == couponTypes.PERCENTAGE && couponAmount >= 100) {
        return next(new AppError(messages.coupon.percentage, 400))
    }
    //prepare
    const coupon = new Coupon({
        code,
        couponAmount,
        couponType,
        fromDate,
        toDate,
        createdBy: req.userAuth._id
    })
    const createdCoupon = await coupon.save()
    if (!createdCoupon) {
        return next(new AppError(messages.coupon.failToCreate, 500))
    }
    //response
    return res.status(201).json({ message: messages.coupon.createdSuccessfully, success: true })
}

//get all coupon of specific admin
export const allCoupon = async (req, res, next) => {
    const allCoupon = await Coupon.find({ createdBy: req.userAuth._id })
    if (!allCoupon) {
        return next(new AppError("you do not have ani coupons", 404))
    }
    return res.status(200).json({ success: true, data: allCoupon })
}

//update coupon
export const updateCoupon = async (req, res, next) => {
    //get data 
    const { code, couponAmount, couponType, fromDate, toDate } = req.body
    //cehck existence
    const couponExist = await Coupon.findOne({ code, createdBy: req.userAuth })
    if (!couponExist) {
        return next(new AppError(messages.coupon.notFound, 404))
    }
    //prepare
    if (couponType && couponAmount) {
        if (couponType == couponTypes.PERCENTAGE && couponAmount >= 100) {
            return next(new AppError(messages.coupon.percentage, 400))
        }
        couponExist.couponType = couponType
        couponExist.couponAmount = couponAmount
    }
    if (fromDate) {
        if (fromDate < couponExist.fromDate) {
            return next(new AppError("invaled from date ", 400))
        }
        couponExist.fromDate = fromDate
    }
    if (toDate) {
        if (toDate < Date.now()) {
            return next(new AppError("to date should be bigger than now", 400))
        }
        couponExist.toDate = toDate
    }
    const updatedCoupon = await couponExist.save()
    return res.status(200).json({ message: messages.coupon.updatedSuccessfully, success: true, data: updatedCoupon })



}

//delete coupon 
export const deleteCoupon = async(req, res, next) => {
    //get data 
    const { code } = req.body
    const coupon = await Coupon.findOneAndDelete({ code, createdBy:req.userAuth._id })
    if(!coupon){
        return next(new AppError(messages.coupon.notFound,404))
    }
    return res.status(200).json({message:messages.coupon.deletedSuccessfully,success:true})
} 