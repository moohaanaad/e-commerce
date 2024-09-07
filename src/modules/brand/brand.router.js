import { Router } from "express";
import { fileuploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as brandController from "./brand.controller.js";
import * as val from "./brand.validation.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const brandRouter = Router()

//create brand
brandRouter.post('/add-brand',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    fileuploads({ folder: 'brand' }).single("logo"),
    isValid(val.createBrandSchema),
    asyncHandler(brandController.addBrand)
)
//update brand
brandRouter.put('/update-brand/:brandId',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    fileuploads({ folder: 'brand' }).single("logo"),
    isValid(val.updateBrandSchema),
    asyncHandler(brandController.updateBrand)
)
//get all brands 
brandRouter.get('/all-brands',
    asyncHandler(brandController.allbrands)
)
//get specific brand
brandRouter.get('/get-brand/:brandId',
    isValid(val.getBrandSchema),
    asyncHandler(brandController.getBrand)
)
//delete brand
brandRouter.delete('/delete-brand/:brandId',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    isValid(val.getBrandSchema),
    asyncHandler(brandController.deleteBrand)
)

export default brandRouter