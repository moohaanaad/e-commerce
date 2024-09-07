import { Cart, Coupon, Order, Product } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { orderStatus } from "../../utils/constant/enums.js"
import { messages } from "../../utils/constant/messages.js"
import Stripe from "stripe"

//create order
export const createOrder = async (req, res, next) => {
    const { address, coupon, phone, payment } = req.body
    //check existence
    let couponExist = ""
    if (!coupon) {
        const couponExist = await Coupon.findOne({ code: coupon })
        if (!couponExist) {
            return next(new AppError(messages.coupon.notFound))
        }
        if (couponExist.formDate > Date.now() || couponExist.toDate < Date.now()) {
            return next(new AppError(messages.coupon.invalid, 404))
        }
    }
    //check cart 
    const cart = await Cart.findOne({ user: req.userAuth._id }).populate("products.productId")
    const products = cart.products
    if (products <= 0) {
        return next(new AppError(messages.cart, 404))
    }
    //check product 
    let productsList = []
    let orderPrice = 0
    for (const product of products) {
        const productExist = await Product.findById(product.productId)
        if (!productExist) {
            return next(new AppError(messages.product.notFound, 404))
        }
        if (!productExist.inStock(product.quantity)) {
            return next(new AppError(messages.product.stock, 400))
        }

        productsList.push({
            productId: productExist._id,
            title: productExist.title,
            quantity: product.quantity,
            finalPrice: productExist.finalPrice,
            itemPrice: productExist.price
        })
        orderPrice += productExist.finalPrice * product.quantity
    }
    //create order
    const order = new Order({
        user: req.userAuth._id,
        products: productsList,
        address,
        phone,
        coupon: {
            couponId: couponExist?._id,
            code: couponExist?.code,
            discount: couponExist?.couponAmount
        },
        status: orderStatus.PLACED,
        payment,
        orderPrice,
        finalPrice: orderPrice - (orderPrice * ((couponExist?.couponAmount || 0) / 100))
    })
    //save order
    const createdOrder = await order.save()
    if (!createdOrder) {
        return next(new AppError(messages.order.failToCreate, 500))
    }
    //visa ==> stripe
    if (payment == "visa") {
        const stripe = new Stripe("sk_test_51PtEDmP2Soe3ZKLKmoYdoyFxtEr26e49ilTO3qVDWtBLMi71unLmlms6DhB0f92ZWZcixNwhqX4Ot7GyEwdP2Caj00eUrKcHyA")
        const checkout = await stripe.checkout.sessions.create({
            success_url: "http://www.google.com",
            cancel_url: "http://www.facebook.com",
            payment_method_types: ["card"],
            mode: 'payment',
            line_items: createdOrder.products.map((product) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.title
                        },
                        unit_amount: product.itemPrice * 100
                    },
                    quantity: product.quantity
                }
            })
        })
        return res.status(201).json({ message: messages.order.createdSuccessfully, success: true, data: createdOrder, url: checkout.url })
    }
    //response
    return res.status(201).json({ message: messages.order.createdSuccessfully, success: true, data: createdOrder })
}

//delete order
export const deleteOrder = async (req, res, next) => {
    //get data
    const { _id } = req.params
    //check existence
    const order = await Order.findOneAndUpdate({ _id, user: req.userAuth._id }, { status: orderStatus.CANCELED })
    if (!order) {
        return next(new AppError(messages.order.notFound, 404))
    }
    return res.status(200).json({ message: messages.order.deletedSuccessfully, success: true })
}

//get all order
export const getAllOrders = async (req, res, next) => {
    const order = await Order.find({ user: req.userAuth._id, status: { $ne: orderStatus.CANCELED } })
    if (!order) {
        return next(new AppError(messages.order.notFound, 404))
    }
    return res.status(200).json({ success: true, data: order })
}

//get specific order
export const getSpecificOrder = async (req, res, next) => {
    //get data
    const { _id } = req.params
    const order = await Order.findOne({ _id, user: req.userAuth._id, status: { $ne: orderStatus.CANCELED } })
    if (!order) {
        return next(new AppError(messages.order.notFound, 404))
    }
    return res.status(200).json({ success: true, data: order })
}