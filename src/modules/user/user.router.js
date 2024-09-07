import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as userController from "./user.controller.js";
import { cloudUploads } from "../../utils/multer.cloud.js";
import { isValid } from "../../middleware/validation.js";
import { cahngePasswordVal } from "./user.validation.js";

const userRouter = Router()

//get user data
userRouter.get('/',
    isAuthenticate(),
    asyncHandler(userController.getUser)
)

//update user
// userRouter.put('/',
//     isAuthenticate(),
// cloudUploads(),
// isValid(),
// asyncHandler()
// )

//delete user
userRouter.delete('/',
    isAuthenticate(),
    asyncHandler(userController.deleteUser)
)

//change password
userRouter.put('/change-password',
    isAuthenticate(),
    isValid(cahngePasswordVal),
    asyncHandler(userController.changePassword)
)

//update user
userRouter.put('/',
    isAuthenticate(),
    asyncHandler(userController.updateUser)
)

export default userRouter