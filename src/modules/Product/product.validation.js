import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

const parseArry = (value, helper) =>{
    value = JSON.parse(value)
    const schema = joi.array().items(joi.string())
    const { error } = schema.validate(value, {abortEarly:false})
    if(error){
        return helper('invaled array')
    }else{
        return true
    }
}
export const addProductSchema = joi.object({
    title:generalFields.name.required(),
    description:generalFields.name.required(),
    category:generalFields.objectId.required(),
    subcategory:generalFields.objectId.required(),
    brand:generalFields.objectId.required(),
    price:generalFields.price.required(),
    discount:generalFields.price,
    size:joi.custom(parseArry),
    color:joi.custom(parseArry),
    stock:generalFields.price
}).required()

export const specificProductSchema = joi.object({
    _id:generalFields.objectId.required()
}).required()