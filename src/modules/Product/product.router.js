import { Router } from "express";
import { fileuploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import * as val from "./product.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as produCtontroller from "./product.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const productRouter = Router()
//create product
productRouter.post('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN, roles.SEELER]),
    fileuploads({ folder: 'product' }).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ]),
    isValid(val.addProductSchema),
    asyncHandler(produCtontroller.addProduct)
)
//get all products
productRouter.get('/all-products', asyncHandler(produCtontroller.getProducts))
//get specific product
productRouter.get("/specific-product/:_id",
    isValid(val.specificProductSchema),
    asyncHandler(produCtontroller.specificProduct)
)

//update product
productRouter.put('/:productId',
    isAuthenticate(),
    isAuthorized([roles.ADMIN, roles.SEELER]),
    fileuploads({ folder: 'product' }).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ]),
    asyncHandler(produCtontroller.updateProduct)
)

//delete product
productRouter.delete('/:productId',
    isAuthenticate(),
    isAuthorized([roles.ADMIN, roles.SEELER]),
    asyncHandler(produCtontroller.deleteProduct)
)


export default productRouter