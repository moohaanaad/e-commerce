import { Brand } from "../../../db/models/brand.model.js"
import { ApiFeature } from "../../utils/apiFeature.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { deleteFile } from "../../utils/deleteFile.js"


//create brand
export const addBrand = async (req, res, next) => {
    //get data
    let { name } = req.body
    name = name.toLowerCase()
    //check file
    if (!req.file) {
        return next(new AppError(messages.image, 400))
    }
    //check existence
    const brandExist = await Brand.findOne({ name }) // {} , null
    if (brandExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.brand.alreadyExist, 409))
    }
    //perpare data
    const brand = new Brand({
        name,
        logo: req.file.path,
        createdBy:req.userAuth._id
    })
    //save to DB
    const createdBrand = await brand.save()
    if (!createdBrand) {
        req.failImage = req.file
        return next(new AppError(messages.brand.failToCreate, 500))
    }
    //send response
    return res.status(201).json({ message: messages.brand.createdSuccessfully, success: true, data: createdBrand })
}

// get all brands
export const allbrands = async (req, res, next) => {
    const apiFeature = new ApiFeature(Brand.find(), req.query).pagination().sort().select().filter()
    const brands = await apiFeature.mongooseQuery
    return res.status(200).json({ success: true, data: brands })
}

//get specific brand
export const getBrand = async (req, res, next) => {
    //get data
    const { brandId } = req.params
    //check existence
    const brandExist = await Brand.findById(brandId)
    if(!brandExist){
        return  next(new AppError(messages.brand.notFound, 404))
    }
    // response
    return res.status(200).json({data:brandExist,success:true})
}

//update brand
export const updateBrand = async (req, res, next) => {
    //get data
    const { brandId } = req.params
    let { name } = req.body
    //check existence
    const brandExist = await Brand.findById(brandId)
    if (!brandExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.brand.notFound, 404))
    }
    if (name) {
        name = name.toLowerCase()
        const nameExist = await Brand.findOne({ name, _id: { $ne: brandId } })
        if(nameExist){
            
            req.failImage = req.file.path
            return next(new AppError(messages.brand.alreadyExist, 404))
        }
        brandExist.name = name
    }
    //check file
    if(req.file){
        deleteFile(brandExist.logo)
        brandExist.logo = req.file.path
    }
    //update data
    const updatedBrand = await brandExist.save()
    if(!updatedBrand){
        req.failImage = req.file.path
        return next(new AppError(messages.brand.failToCreate, 500))
    }
    //response
    return res.status(200).json({message:messages.brand.updatedSuccessfully, success:true, data:brandExist})
}

//delete brand
export const deleteBrand = async (req, res, next) => {
    //get data
    const { brandId} = req.params
    //check existence
    const brandExist = await Brand.findByIdAndDelete(brandId)
    if(brandExist){
        deleteFile(brandExist.logo)
        return res.status(200).json({message:messages.brand.deletedSuccessfully,success:true})
    }
    return next(new AppError(messages.brand.notFound, 404))
}