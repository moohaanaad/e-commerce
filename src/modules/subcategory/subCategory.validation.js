import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createSubcateroySchema = joi.object({
    name: generalFields.name.required(),
    category:generalFields.objectId.required()
})

export const getSubcategorySchema =joi.object({
    category: generalFields.objectId.required()
}).required()
//delete sub
export const deleteSubcategorySchema =joi.object({
    id: generalFields.objectId.required()
}).required()

//update sub
export const updateSubcategorySchema =joi.object({
    id: generalFields.objectId.required(),
    name:generalFields.name,
    category:generalFields.objectId
}).required()