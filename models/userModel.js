import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    telephone: {
        type: String,
        required: true
    },
    root: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dwiylz9ql/image/upload/v1638448285/nextjs_media/tqsbnretollxoejkhqfu.jpg'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // emailToken: {
    //     type: String,
    // }
}, {
    timestamps: true
})

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)

export default Dataset