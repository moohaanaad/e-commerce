import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const addReview = joi.object({
    comment: generalFields.comment.required(),
    rate:generalFields.rate,
    productId:generalFields.objectId.required()
}).required()