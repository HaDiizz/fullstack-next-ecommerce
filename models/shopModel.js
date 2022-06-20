import mongoose from 'mongoose'

const shopSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    shopName: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: 'user'
    },
    status: {
        type: Boolean,
        default: false
    },
    accepted: {
        type: Boolean,
        default: false
    },
    public_key: {
        type: String,
        unique: true
    },
    secret_key: {
        type: String,
        unique: true
    },
    isHalal: {
        type: Boolean,
    },
    logo: {
        type: String,
        default: 'https://media.istockphoto.com/photos/double-sided-back-lit-signage-circular-board-led-glow-advertising-picture-id917133702?b=1&k=20&m=917133702&s=170667a&w=0&h=Hbonv4RwJ5Uetme2mir3LvxeF_DjrS8k64qtkeUXrJc='
    }
}, {
    timestamps: true
})

let Dataset = mongoose.models.shop || mongoose.model('shop', shopSchema)

export default Dataset