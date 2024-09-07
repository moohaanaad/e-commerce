import { connectDB } from "../db/connection.js"
// import adminRouter from "./modules/admin/admin.router.js"
// import authRouter from "./modules/auth/auth.router.js"
// import brandRouter from "./modules/brand/brand.router.js"
// import categoryRouter from "./modules/category/category.router.js"
// import productRouter from "./modules/Product/product.router.js"
// import subCategoryRouter from "./modules/subcategory/subCategory.router.js"
// import userRouter from "./modules/user/user.router.js"
// import wishlistRouter from "./modules/wishlist/wishlist.router.js"
import * as allRouter from './index.js'
import { globalErrorHandling } from "./utils/asyncHandler.js"

export const bootStrap = (app, express) => {
    app.use(express.json())
    connectDB()
    app.use("/category", allRouter.categoryRouter)
    app.use("/subcategory", allRouter.subcategoryRouter)
    app.use("/brand", allRouter.brandRouter)
    app.use("/product", allRouter.productRouter)
    app.use("/auth",allRouter.authRouter)
    app.use("/admin",allRouter.adminRouter)
    app.use("/wishlist",allRouter.wishlistRouter)
    app.use("/user",allRouter.userRouter)
    app.use("/review",allRouter.reviewRouter)
    app.use("/coupon",allRouter.couponRouter)
    app.use("/cart",allRouter.cartRouter)
    app.use("/order",allRouter.orderRouter)
    app.use(globalErrorHandling)
}