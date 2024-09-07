import slugify from "slugify"
import { Category } from "../../../db/models/category.model.js"
import { SubCategory } from "../../../db/models/subcategory.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { deleteFile } from "../../utils/deleteFile.js"

//create Subcateroy
export const createSubcateroy = async (req, res, next) => {
    const { name, category } = req.body
    const categoryExist = await Category.findById(category)
    if (!categoryExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.category.notFound, 404))
    }
    const subcategoryExist = await SubCategory.findOne({ name })
    if (subcategoryExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.subCategory.alreadyExist, 409))
    }
    if (!req.file) {
        return next(new AppError(messages.image, 409))
    }
    const slug = slugify(name)
    //prepare data
    const subcategory = new SubCategory({
        name,
        slug,
        image: req.file.path,
        category,
        createdBy:req.userAuth._id

    })
    const subCategoryCreated = await subcategory.save()
    if (!subCategoryCreated) {
        req.failImage = req.file.path
        return next(new AppError(messages.subCategory.failToCreate, 500))
    }
    return res.status(201).json({ message: messages.subCategory.createdSuccessfully, subCategoryCreated, success: true })
}

//get subcategories
export const getSubcategories = async (req, res, next) => {
    const { category } = req.params
    const categoryExist = await Category.findById(category)
    if (!categoryExist) {
        next(new AppError(messages.category.notFound, 404))
    }
    const subcategories = await SubCategory.find({ category }).populate({ path: 'category' })
    return res.status(200).json({ data: subcategories, success: true })
}

//delete subcategory
export const deleteSubcategory = async (req, res, next) => {
    //get data
    const { id } = req.params
    //check existence
    const subCategoryExist = await SubCategory.findByIdAndDelete(id)
    if (subCategoryExist) {
        deleteFile(subCategoryExist.image)
        return res.status(200).json({ message: messages.subCategory.deletedSuccessfully, success: true })
    }
    return next(new AppError(messages.subCategory.alreadyExist, 404))
}

//update subcategory
export const updateSubcategory = async (req, res, next) => {
    //get data
    const { id } = req.params
    let {name, category} = req.body
    //check existence
    const subCategoryExist = await SubCategory.findById(id)
    if (!subCategoryExist) {
        req.failImage = req.file?.path
        return next(new AppError(messages.subCategory.notFound, 404))
    }
    const categoryExist = await Category.findById(category)
    if(!categoryExist){
            req.failImage = req.file?.path
            return next(messages.category.notFound, 404)
        }
        if(name){
        name = name.toLowerCase()
        const nameExist = await SubCategory.findOne({name, _id:{$ne:id}})
        if(nameExist){
            req.failImage = req.file?.path
            next(new AppError(messages.subCategory.alreadyExist, 409))
        }
    }
    const slug = slugify(name)
    //check file
    if(req.file){
        deleteFile(subCategoryExist.image)
    }
    //prepare 
    const subcategory = new SubCategory({
        name,
        slug,
        image: req.file.path,
        category
    })
    //update sub
    const updatedSub = await subcategory.save()
    if(!updatedSub){
        req.failImage = req.file?.path
        next(new AppError(messages.subCategory.failToCreate, 500) )
    }
    //response
    return res.status(200).json({ message: messages.subCategory.updatedSuccessfully, success: true })
}
