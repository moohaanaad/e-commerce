import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createCouponVal = joi.object({
    code: generalFields.code.required(),
    couponAmount: generalFields.couponAmount.required(),
    couponType: generalFields.couponTypes.required(),
    fromDate: generalFields.fromDate,
    toDate: generalFields.toDate
}).required()

export const updateCouponVal = joi.object({
    code: generalFields.code.required(),
    couponAmount: generalFields.couponAmount,
    couponType: generalFields.couponTypes,
    fromDate: joi.date(),
    toDate: joi.date()
}).required()

export const deleteCouponVal = joi.object({
    code: generalFields.code.required()
}).required()