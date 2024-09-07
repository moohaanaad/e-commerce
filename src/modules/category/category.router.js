import { Router } from "express";
import { fileuploads, fileValidation } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import * as val from "./category.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as categoryController from "./category.controller.js";
import subCategoryRouter from "../subcategory/subCategory.router.js";
import { cloudUploads } from "../../utils/multer.cloud.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";
const categoryRouter = Router()

categoryRouter.use('/get-category/:category', subCategoryRouter)

 //  create category
categoryRouter.post('/add-category',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    fileuploads({ folder: "category" }).single("image"),
    isValid(val.createCategorySchema),
    asyncHandler(categoryController.createCategory)
)

//get all categories
categoryRouter.get('/all-categories',
    asyncHandler(categoryController.allCategories)
)

// update category
categoryRouter.put('/update-category/:categoryId',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    fileuploads({ folder: "category" }).single("image"),
    isValid(val.updateCategorySchema),
    asyncHandler(categoryController.updateCategory)
)
//delete category
categoryRouter.delete('/delete-category/:_id',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    asyncHandler(categoryController.deleteCategory)
)

//create category using cloud
categoryRouter.post('/add-category-by-cloud',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    cloudUploads().single("image"),
    asyncHandler(categoryController.createCategoryCloud)
)
//update category
categoryRouter.post('/update-category-by-cloud',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    cloudUploads().single("image"),
    asyncHandler(categoryController.updateCategoryCloud)
)
//delete category
categoryRouter.post('/delete-category-by-cloud',
    isAuthenticate(),
    isAuthorized([roles.ADMIN,roles.SEELER]),
    cloudUploads().single("image"),
    asyncHandler(categoryController.deleteCategoryCloud)
)

categoryRouter.get('/',
    isAuthenticate(),
    asyncHandler(categoryController.categorySearch)
)

// categoryRouter.get('/get-category/:_id', asyncHandler(getSpecificCategory))
export default categoryRouter