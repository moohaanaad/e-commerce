import multer, { diskStorage } from "multer";
import { AppError } from './appError.js';

export const cloudValidation = {
    image: ['image/png', 'image/jpeg']
}
export const cloudUploads = ({ allowType = cloudValidation.image } = {}) => {
    const storage = diskStorage({

    })
    const fileFilter = (req, file, cb) => {
        if (allowType.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new AppError('invalid file format', 400), false)
        }
    }
    return multer({ storage, fileFilter })
}