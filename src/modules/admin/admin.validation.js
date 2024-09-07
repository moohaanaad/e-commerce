import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//add user
export const addUserVal = joi.object({
    userName: generalFields.name.required(),
    email: generalFields.email.required(),
    phone: generalFields.phone.required(),
    role: generalFields.role,
    DOB: generalFields.DOB,
    address: generalFields.address
}).required()

//update user 
export const updateUSerVal = joi.object({
    role: generalFields.role,
    status: generalFields.role,
    isActive: generalFields.role,
    userId: generalFields.objectId
}).required()