import slugify from "slugify"
import { Brand } from "../../../db/models/brand.model.js"
import { Category } from "../../../db/models/category.model.js"
import { SubCategory } from "../../../db/models/subcategory.model.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Product } from "../../../db/models/product.model.js"
import { ApiFeature } from "../../utils/apiFeature.js"
import { deleteFile } from "../../utils/deleteFile.js"

//create product  ...todo delete and check file
export const addProduct = async (req, res, next) => {
    //get data
    let { title, description, category, subcategory, brand, price, discount, size, color, stock } = req.body
    let imagePaths = []

    //cehck file
    if (!req.files) {
        next(new AppError(messages.image, 404))
    }
    //check existence
    const categoryExist = await Category.findById(category)
    if (!categoryExist) {
        imagePaths.push(req.files.mainImage[0].path)
        .log(imagePaths);
        for (let i = 0; i < req.files.subImages.length; i++) {
            imagePaths.push(req.files.subImages[i].path)
        }
        for (let i = 0; i < imagePaths.length; i++) {
            deleteFile(imagePaths[i])
        }
        return next(new AppError(messages.category.notFound, 404))
    }
    const subcategoryExist = await SubCategory.findById(subcategory)
    if (!subcategoryExist) {
        imagePaths.push(req.files.mainImage[0].path)
        for (let i = 0; i < req.files.subImages.length; i++) {
            imagePaths.push(req.files.subImages[i].path)
        }
        for (let i = 0; i < imagePaths.length; i++) {
            deleteFile(imagePaths[i])
        }
        return next(new AppError(messages.subCategory.notFound, 404))
    }
    const brandExist = await Brand.findById(brand)
    if (!brandExist) {
        imagePaths.push(req.files.mainImage[0].path)
        .log(imagePaths);
        for (let i = 0; i < req.files.subImages.length; i++) {
            imagePaths.push(req.files.subImages[i].path)
        }
        for (let i = 0; i < imagePaths.length; i++) {
            deleteFile(imagePaths[i])
        }
        return next(new AppError(messages.brand.notFound, 404))
    }
    title = title.toLowerCase()
    const slug = slugify(title)
    //prepare data
    const product = Product({
        title,
        slug,
        description,
        category,
        subcategory,
        brand,
        price,
        discount,
        size: JSON.parse(size),
        color: JSON.parse(color),
        stock,
        mainImage: req.files.mainImage[0].path,
        subImages: req.files.subImages.map(img => img.path),
        createdBy: req.userAuth._id,
        updatedBy: req.userAuth._id
    })
    //save data in DB
    const addedProduct = await product.save()
    if (!addedProduct) {
        imagePaths.push(req.files.mainImage[0].path)
        for (let i = 0; i < req.files.subImages.length; i++) {
            imagePaths.push(req.files.subImages[i].path)
        }
        for (let i = 0; i < imagePaths.length; i++) {
            deleteFile(imagePaths[i])
        }
        next(new AppError(messages.product.failToCreate, 500))
    }
    //response
    res.status(201).json({ message: messages.brand.createdSuccessfully, success: true, data: addedProduct })
}

//gets all products
export const getProducts = async (req, res, next) => {
    const apiFeature = new ApiFeature(Product.find(), req.query).pagination().sort().select().filter()
    const products = await apiFeature.mongooseQuery
    //response
    return res.status(200).json({ success: true, data: products })

}

//get specific product
export const specificProduct = async (req, res, next) => {
    //get data
    const { _id } = req.params
    const product = await Product.findById(_id).populate({ path: 'category' }).populate({ path: 'subcategory' }).populate({ path: 'brand' })
    if (!product) {
        return next(new AppError(messages.product.notFound, 404))
    }
    //response
    return res.status(200).json({ success: true, data: product })
}

//update product
export const updateProduct = async (req, res, next) => {
    //get data
    let { title, description, price, discount, size, color, stock } = req.body
    const { productId } = req.params
    let imagePaths = []
    //check existence
    let productExist = await Product.findById(productId)
    if (!productExist) {

        imagePaths.push(req.files.mainImage[0].path)
        for (let i = 0; i < req.files.subImages.length; i++) {
            imagePaths.push(req.files.subImages[i].path)
        }
        for (let i = 0; i < imagePaths.length; i++) {
            deleteFile(imagePaths[i])
        }

        return next(new AppError(messages.product.notFound, 404))
    }
    //prepare data
    if (req.files) {
        imagePaths.push(productExist.mainImage)
        imagePaths.push(...productExist.subImages)
        for (let i = 0; i < imagePaths.length; i++) {
            deleteFile(imagePaths[i])
        }
        req.body.mainImage = req.files.mainImage[0].path,
            req.body.subImages = req.files.subImages.map(img => img.path)
    }
    if (title) {
        req.body.title = title
        req.body.slug = slugify(title)
    }
    req.body.updatedBy = req.userAuth._id
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true })
    if (!updatedProduct) {
        imagePaths.push(req.files?.mainImage[0].path)
        for (let i = 0; i < req.files?.subImages.length; i++) {
            imagePaths.push(req.files.subImages[i].path)
        }
        for (let i = 0; i < imagePaths.length; i++) {
            deleteFile(imagePaths[i])
        }
        return next(new AppError(messages.product.failToCreate, 500))
    }
    return res.status(200).json({ message: messages.product.updatedSuccessfully, success: true, data: updatedProduct })
}

//delete product
export const deleteProduct = async (req, res, next) => {
    //get data
    const { productId } = req. params
    let imagePaths = []
    // check existence
    const productExist = await Product.findByIdAndDelete(productId)
    if(!productExist){
        return next(new AppError(messages.product.notFound, 404))
    }
    imagePaths.push(productExist.mainImage)
    imagePaths.push(...productExist.subImages)
    for (let i = 0; i < imagePaths.length; i++) {
        deleteFile(imagePaths[i])
    }
    return res.status(200).json({message:messages.product.deletedSuccessfully,success:true})

}