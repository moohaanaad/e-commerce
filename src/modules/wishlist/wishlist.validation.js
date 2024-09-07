import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const wishlistVal = joi.object({
    productId:generalFields.objectId.required()
}).required()