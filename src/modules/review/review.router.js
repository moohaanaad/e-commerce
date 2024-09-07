import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { addReview } from "./review.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const reviewRouter = Router()

reviewRouter.post('/',
    isAuthenticate(),
    isValid(addReview),
    asyncHandler(addReview)

)

export default reviewRouter