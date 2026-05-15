const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    mobileNumber: {
        type: String,
        required: false,
        trim: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
    attempts: {
        type: Number,
        default: 0,
    },
    lastSentAt: {
        type: Date,
        default: Date.now,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

otpTokenSchema.index({ email: 1, mobileNumber: 1, isUsed: 1 });

module.exports = mongoose.model('OtpToken', otpTokenSchema);
