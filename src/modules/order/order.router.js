import { Router } from "express";
import * as orderController from "./order.controller.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderVal } from "./order.validation.js";

const orderRouter = Router()

//create order
orderRouter.post('/', isAuthenticate(),
    isValid(createOrderVal),
    asyncHandler(orderController.createOrder))

//delete order
orderRouter.delete('/:_id', isAuthenticate(),
    asyncHandler(orderController.deleteOrder))

//getAll order
orderRouter.get('/', isAuthenticate(),
    asyncHandler(orderController.getAllOrders))

//getSpecific order
orderRouter.get('/:_id', isAuthenticate(),
    asyncHandler(orderController.getSpecificOrder))

export default orderRouter