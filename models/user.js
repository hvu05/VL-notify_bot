const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    lmsUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    userName: {
        type: String,
        required: false,
        trim: true,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    collection: "users", // ⚠️ tên collection TRONG ATLAS
    versionKey: false,
}
)
module.exports = mongoose.model('User', userSchema)