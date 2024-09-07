export const roles = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    SEELER: 'seller'
}
Object.freeze(roles)

export const status = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    BLOCKED: 'blocked',
    DELEETED: "deleted"
}
Object.freeze(status)

export const couponTypes = {
    FIXED_AMOUNT: "fixedAmount",
    PERCENTAGE: "percentage"
}
Object.freeze(couponTypes)

export const orderStatus = {
    PLACED: "palced",
    SHIPPING: "shipping",
    DELIVERED: "delivered",
    CANCELED: "canceled",
    REFUNDED: "refunded"
}
Object.freeze(orderStatus)

export const payment = {
    CASH:"cash",
    VISA:"visa"
}
Object.freeze(payment)
