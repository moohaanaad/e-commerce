import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//signup
export const signupVal = joi.object({
    userName: generalFields.name.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    repassword: generalFields.rePassword.required(),
    phone: generalFields.phone.required(),
    DOB: generalFields.DOB,
    address: generalFields.address
}).required()

//login
export const loginVal = joi.object({
    phone: generalFields.phone.when("email", {
        is: joi.required(),
        then:joi.optional(),
        otherwise:joi.required()
    }
    ),
    email: generalFields.email,
    password:generalFields.password.required()
}).required()

//forget password
export const frogetPasswordVal = joi.object({
    email:generalFields.email.required()
}).required() 

//reset password
export const resetPasswordVal = joi.object({
    email:generalFields.email.required(),
OTP:generalFields.OTP.required(),
password:generalFields.password.required(),
rePassword:generalFields.rePassword.required()
}).required()
