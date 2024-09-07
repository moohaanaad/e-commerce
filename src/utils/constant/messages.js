

const generateMessage = (entity) => ({
    notFound: `${entity} not found`,
    alreadyExist: `${entity} already exist`,
    failToCreate: `fail to create ${entity}`,
    createdSuccessfully: `${entity} created Successfully`,
    updatedSuccessfully: `${entity} updated Successfully`,
    deletedSuccessfully: `${entity} deleted Successfully`,
    invalid: `${entity} invalid`
})


export const messages = {
    category: generateMessage('category'),
    subCategory: generateMessage('subCategory'),
    product: generateMessage('product'),
    brand: generateMessage('brand'),
    product: {
        ...generateMessage('product'),
        stock:"this product is out of stock"
    },
    image: {
        required: "image is required"
    },
    user: {
        ...generateMessage('user'),
        phone: "phone already exist",
        email: "email already exist",
        verifiedSuccessfully: "account verified successfully",
        login: "login successfully",
        invalidcrendential: "invalid credential",
        hasOTP:"you already has OTP",
        OTP:"check your email",
        invalidOTP :"invalid otp"
    },
    wishlist: generateMessage('wishlist'),
    token: "signup or login first",
    review: generateMessage('review'),
    coupon: {
        ...generateMessage("coupon"),
        percentage: "must between 1 and 100"
    },
    cart:"cart empity",
    order:generateMessage("order")
}