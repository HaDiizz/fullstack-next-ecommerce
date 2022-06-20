import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    shop: {
        type: mongoose.Types.ObjectId,
        ref: 'shop'
    },
    time: String,
    tel: String,
    note: String,
    cart: Array,
    total: Number,
    paymentId: String,
    method: String,
    status: {
        type: Number,
        default: 0
    },
    paid: {
        type: Boolean,
        default: false
    },
    image: String,
    dateOfPayment: Date,
}, {
    timestamps: true
})


let Dataset = mongoose.models.order || mongoose.model('order', orderSchema)

export default Dataset