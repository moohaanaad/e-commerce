import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addToCart } from "./cart.controller.js";
import { isValid } from "../../middleware/validation.js";
import { addToCartVal } from "./cart.validation.js";


const cartRouter = Router()
cartRouter.post('/',
    isAuthenticate(),
    isValid(addToCartVal),
    asyncHandler(addToCart)
)
// cartRouter.put('/delete-specific-prduct',
//     isAuthenticate(),
//     asyncHandler(deleteCart)
// )

export default cartRouter