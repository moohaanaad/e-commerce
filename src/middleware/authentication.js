import { User } from "../../db/models/user.model.js"
import { AppError } from "../utils/appError.js"
import { messages } from "../utils/constant/messages.js"
import { verifyToken } from "../utils/token.js"


export const isAuthenticate = () => {
    return async (req, res, next) => {
        const { token } = req.headers
        if (!token) {
            return next(new AppError(messages.token, 401))
        }
        const payload = verifyToken({ token })
        const user = await User.findById(payload._id)
        if (!user) {
            return next(messages.token, 401)
        }
        req.userAuth = user
        next()
    }

}

export const isAuthorized = (roles = []) => {
    return (req, res, next) => {
        const { role } = req.userAuth
        if (!roles.includes(role)) {
            return next(new AppError("you are not authorized", 401))
        }
        next()
    }
}