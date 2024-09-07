import { Router } from "express";
import { fileuploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { createSubcateroySchema, deleteSubcategorySchema, getSubcategorySchema, updateSubcategorySchema } from "./subCategory.validation.js";
import * as subCategoryController from "./subCategory.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const subCategoryRouter = Router({ mergeParams: true })

//add subcategory
subCategoryRouter.post('/add-subcategory',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    fileuploads({ folder: "subcategory" }).single("image"),
    isValid(createSubcateroySchema),
    asyncHandler(subCategoryController.createSubcateroy)
)

//get all subcategories of specific category
subCategoryRouter.get('/',
    isValid(getSubcategorySchema),
    asyncHandler(subCategoryController.getSubcategories)
)

//delete subcategory
subCategoryRouter.delete('/:id',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    isValid(deleteSubcategorySchema),
    asyncHandler(subCategoryController.deleteSubcategory)
)

//update subcategory
subCategoryRouter.put('/:id',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    fileuploads({ folder: "subcategory" }).single("image"),
    isValid(updateSubcategorySchema),
    subCategoryController.updateSubcategory
)

export default subCategoryRouter