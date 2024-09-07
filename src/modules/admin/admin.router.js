import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { roles } from "../../utils/constant/enums.js";
import { cloudUploads } from "../../utils/multer.cloud.js";
import * as val from "./admin.validation.js";
import * as adminController from "./admin.controller.js";


const adminRouter = Router()

//add user
adminRouter.post('/',
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    cloudUploads().single('image'),
    isValid(val.addUserVal),
    asyncHandler(adminController.addUser)
)
//update user
adminRouter.put("/update/:userId",
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    isValid(val.updateUSerVal),
    asyncHandler(adminController.updateUser)
)
//get all users
adminRouter.get("/",
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(adminController.allUser)
)
// delete user 
adminRouter.delete("/:userId",
    isAuthenticate(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(adminController.deleteUser)
)

export default adminRouter

