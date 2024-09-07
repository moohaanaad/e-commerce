import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{
    timestamps: true
})

export const Brand = mongoose.model('Brand', brandSchema)

