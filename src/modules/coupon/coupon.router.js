import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { roles } from "../../utils/constant/enums.js";
import * as couponController from "./coupon.controller.js";
import * as val from "./coupon.validation.js";



const couponRouter = Router()

//create coupon 
couponRouter.post('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    isValid(val.createCouponVal),
    asyncHandler(couponController.createCoupon)
)

//all coupon of specific admin
couponRouter.get('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(couponController.allCoupon)
)

//update coupon 
couponRouter.put('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    isValid(val.updateCouponVal),
    asyncHandler(couponController.updateCoupon)
)

//delete coupon 
couponRouter.delete('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    isValid(val.deleteCouponVal),
    asyncHandler(couponController.deleteCoupon)
)


export default couponRouter
