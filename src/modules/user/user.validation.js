import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


// export const updateUserVal = joi.object({
//     userName:generalFields.name,
// phone:generalFields.phone,
// password:
// image
// DOB
// address
// })

//cahnge password val
export const cahngePasswordVal = joi.object({
    oldPassword:generalFields.password.required(),
    password:generalFields.password.required(),
    rePassword:generalFields.rePassword.required()

}).required()