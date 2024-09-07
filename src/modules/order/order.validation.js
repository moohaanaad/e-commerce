import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import { payment } from "../../utils/constant/enums.js";

export const createOrderVal = joi.object({
    address:joi.string().required(),
    phone:joi.string().required(),
    payment:joi.string().valid(...Object.values(payment)),
    coupon:joi.string()
   
}).required()