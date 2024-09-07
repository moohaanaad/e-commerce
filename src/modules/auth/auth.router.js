import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import * as val from "./auth.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authController from "./auth.controller.js";
import { isAuthenticate } from "../../middleware/authentication.js";

const authRouter = Router()

//signup
authRouter.post("/signup",
    isValid(val.signupVal),
    asyncHandler(authController.signup)
)
//verify account
authRouter.get("/verify-account",
    asyncHandler(authController.verifyAccount)
)
//login
authRouter.put("/login",
    isValid(val.loginVal),
    asyncHandler(authController.login)
)
//logout
authRouter.put("/logout",
    isAuthenticate(),
    asyncHandler(authController.logout)
)

//forget password
authRouter.put("/forget-password",
    isValid(val.frogetPasswordVal),
    asyncHandler(authController.frogetPassword)
)

// reset password
authRouter.put("/reset-password",
    isValid(val.resetPasswordVal),
    asyncHandler(authController.resetPassword)
)


export default authRouter