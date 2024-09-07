import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addWishlist, allWishlists, delelteWishlist } from "./wishlist.controller.js";
import { wishlistVal } from "./wishlist.validation.js";

const wishlistRouter = Router()
//add
wishlistRouter.put("/add",
    isAuthenticate(),
    isValid(wishlistVal),
    asyncHandler(addWishlist)
)
//delete
wishlistRouter.put("/delete",
    isAuthenticate(),
    isValid(wishlistVal),
    asyncHandler(delelteWishlist)
)
//get all wishlist
wishlistRouter.get("/all-wishlists",
    isAuthenticate(),
    asyncHandler(allWishlists)
)

export default wishlistRouter