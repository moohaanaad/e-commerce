import slugify from "slugify"
import { Category } from "../../../db/models/category.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { deleteFile } from "../../utils/deleteFile.js"
import { SubCategory } from "../../../db/models/subcategory.model.js"
import { Product } from "../../../db/models/product.model.js"
import { ApiFeature } from "../../utils/apiFeature.js"
import cloudinary from "../../utils/cloudniery.js"

//create category
export const createCategory = async (req, res, next) => {
    // get data from req
    const { name } = req.body
    // check existece
    const categoryExist = await Category.findOne({ name: name.toLowerCase() })// {},null
    if (categoryExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.category.alreadyExist, 409))
    }
    if (!req.file) {
        return next(new AppError(messages.image.required, 400))
    }
    // create slug
    const slug = slugify(name)
    // prepare data
    const category = new Category({
        name,
        slug,
        image: req.file.path,
        createdBy: req.userAuth._id
    })
    // create to db
    const createdCategory = await category.save()
    if (!createdCategory) {
        // todo delete image
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response
    return res.status(201).json({ message: messages.category.createdSuccessfully, createdCategory, success: true })
}


// get all categories
export const allCategories = async (req, res, next) => {
    const apiFeature = new ApiFeature(Category.find(), req.query).pagination().sort().select().filter()
    const categories = await apiFeature.mongooseQuery
    return res.status(200).json({ success: true, data: categories })
}

//get specific category with subcategories
export const getSpecificCategory = async (req, res, next) => {
    const { _id } = req.params
    const category = await Category.findById(_id).populate({ path: 'subcategories' })
    if (!category) {
        next(new AppError(messages.category.notFound, 404))
    }
    return res.status(200).json({ data: category, success: true })
}

//update category 
export const updateCategory = async (req, res, next) => {
    const { name } = req.body
    const { categoryId } = req.params
    const categoryExist = await Category.findById(categoryId)
    if (!categoryExist) {
        req.failImage = req.faile.path
        next(new AppError(messages.category.notFound, 404))
    }
    if (req.file) {
        deleteFile(categoryExist.image)
        categoryExist.image = req.file.path
    }
    if (name) {
        categoryExist.name = name.toLowerCase()
        categoryExist.slug = slugify(name)
    }
    const update = await categoryExist.save()
    if (!update) {
        req.failImage = req.faile.path
        next(new AppError(messages.category.failToCreate, 500))
    }
    return res.status(200).json({ message: messages.category.updatedSuccessfully, success: true })
}

//delete category and all related subcategories 
export const deleteCategory = async (req, res, next) => {
    const { _id } = req.params
    const deleteCategory = await Category.findByIdAndDelete(_id)
    if (!deleteCategory) {
        next(new AppError(messages.category.notFound, 404))
    }

    //prepare ids
    const getSubs = await SubCategory.find({ category: _id }).select('image')
    const getProducts = await Product.find({ category: _id }).select('mainImage subImages')
    const subcategoryIds = getSubs.map(sub => sub._id)
    const productIds = getProducts.map(pro => pro._id)

    //delete items
    await SubCategory.deleteMany({ _id: { $in: subcategoryIds } })
    await Product.deleteMany({ _id: { $in: productIds } })

    //delete images
    const imagePaths = getSubs.map(sub => sub.image)
    for (let i = 0; i < getProducts.length; i++) {
        imagePaths.push(getProducts[i].mainImage)
        imagePaths.push(...getProducts[i].subImages)
    }
    for (let i = 0; i < imagePaths.length; i++) {
        deleteFile(imagePaths[i])
    }

    return res.status(200).json({ message: messages.category.deletedSuccessfully, success: true })
}

//create category by cloud
export const createCategoryCloud = async (req, res, next) => {
    // get data from req
    const { name } = req.body
    // check existece
    const categoryExist = await Category.findOne({ name: name.toLowerCase() })// {},null
    if (categoryExist) {
        return next(new AppError(messages.category.alreadyExist, 409))
    }
    if (!req.file) {
        return next(new AppError(messages.image.required, 400))
    }
    // create slug
    const slug = slugify(name)
    // prepare data
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'e-commerce/category'
    })
    const category = new Category({
        name,
        slug,
        image: { secure_url, public_id },
        createdBy: req.userAuth._id
    })
    // create to db
    const createdCategory = await category.save()
    if (!createdCategory) {
        await cloudinary.api.delete_resources_by_prefix(`${secure_url}`)
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response
    return res.status(201).json({ message: messages.category.createdSuccessfully, data: createdCategory, success: true })

}

//update category by cloud
export const updateCategoryCloud = async (req, res, next) => {
    //get data
    const { _id } = req.params
    //check existence 
    const categoryExist = await Category.findById(_id)
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    //prepare data
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { public_id: categoryExist.image.public_id })
        req.body.image = { secure_url, public_id }
    }
    if (req.name) {
        const slug = slugify(name)
        req.body.slug
    }
    categoryExist.name = req.body.name || categoryExist.name
    categoryExist.slug = req.body.slug || categoryExist.slug
    categoryExist.image = req.body.image || categoryExist.image
    categoryExist.save()
}

//delete category and all related subcategories by cloud
export const deleteCategoryCloud = async (req, res, next) => {
    const { _id } = req.params
    const deleteCategory = await Category.findByIdAndDelete(_id)
    if (!deleteCategory) {
        next(new AppError(messages.category.notFound, 404))
    }

    //prepare ids
    const getSubs = await SubCategory.find({ category: _id }).select('image')
    const getProducts = await Product.find({ category: _id }).select('mainImage subImages')
    const subcategoryIds = getSubs.map(sub => sub._id)
    const productIds = getProducts.map(pro => pro._id)

    //delete items
    await SubCategory.deleteMany({ _id: { $in: subcategoryIds } })
    await Product.deleteMany({ _id: { $in: productIds } })

    //delete images
    const imagePaths = getSubs.map(sub => sub.image)
    for (let i = 0; i < getProducts.length; i++) {
        imagePaths.push(getProducts[i].mainImage)
        imagePaths.push(...getProducts[i].subImages)
    }

    for (let i = 0; i < imagePaths.length; i++) {
        if (typeof (imagePaths[i] === "string")) {
            deleteFile(imagePaths[i])
        } else {
            await cloudinary.uploader.destroy(imagePaths[i].public_id)
        }
    }

    //another solution => delete folder 
    await cloudinary.api.delete_resources_by_prefix(`e-commerce/category/${_id}`)
    await cloudinary.api.delete_folder(`e-commerce/category/${_id}`)


    return res.status(200).json({ message: messages.category.deletedSuccessfully, success: true })
}


export const categorySearch = async (req, res, next) => {
    //get data
    const { name } = req.query
    const category = await Category.find({ name })
    if(!category){
        return next(new AppError(messages.category.notFound, 404))
    }
    return res.status(200).json({success:true,data:category})
}