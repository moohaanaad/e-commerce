import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//create brand schema
export const createBrandSchema = joi.object({
    name:generalFields.name.required()
}).required()

// update brand schema
export const updateBrandSchema = joi.object({
    name:generalFields.name,
    brandId:generalFields.objectId.required()
}).required()

//get brand schema
export const getBrandSchema = joi.object({
    brandId:generalFields.objectId.required()
}).required()