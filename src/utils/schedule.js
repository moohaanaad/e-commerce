import schedule from 'node-schedule'
import { Coupon, User } from '../../db/index.js';
import { status } from './constant/enums.js';

//schedule to delete user who did not vrified his account
export const schedulePendingUSers = schedule.scheduleJob('1 1 1 * * *', async function () {
    const expiredUsers = await User.find({ status: status.PENDING, createdAt: { $lte: (Date.now() - 30 * 24 * 60 * 60 * 1000) } })
    const expiredUsersId = expiredUsers.map(user => expiredUsers._id)
    await User.deleteMany({ _id: { $in: expiredUsersId } })
});

//schedule to delete user who deleted his account from 3 month
export const scheduleDeletedUSers = schedule.scheduleJob('1 1 1 * * *', async function () {
    const expiredUsers = await User.find({ status: status.DELEETED, updatedAt: Date.now() - 3 * 30 * 24 * 60 * 60 * 100 })
    const expiredUsersId = expiredUsers.map(user => expiredUsers._id)
    await User.deleteMany({ _id: { $in: expiredUsersId } })
})
//schedule to delete expire coupon
export const scheduleCoupon = schedule.scheduleJob('1 1 1 * * *', async function () {
    const expiredCoupon = await Coupon.find({ toDate: { $lt: Date.now() } })
    const expiredCouponId = expiredCoupon.map(user => expiredCoupon._id)
    await Coupon.deleteMany({ _id: { $in: expiredCouponId } })
})