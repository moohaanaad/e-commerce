import { User } from "../../db/models/user.model.js"
import { AppError } from "../utils/appError.js"
import { messages } from "../utils/constant/messages.js"
import { verifyToken } from "../utils/token.js"


export const isAuthenticate = () => {
    return async (req, res, next) => {
        const { token } = req.headers
        if (!token || token.startsWith("Bearer")) {
            return next(new AppError(messages.token, 401))
        }

        const tokenWithoutBearer = token.split(" ")[1]
        const payload = verifyToken({ token: tokenWithoutBearer })
        const user = await User.findById(payload._id)
        if (!user) {
            return next(new AppError(messages.token, 401))
        }
        req.userAuth = user
        next()
    }

}

export const isAuthorized = (roles = []) => {
    return (req, res, next) => {
        const { role } = req.userAuth
        if (!roles.includes(role)) {
            return next(new AppError(messages.unAuthorized, 401))
        }
        next()
    }
}