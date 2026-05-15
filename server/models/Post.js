const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    imageUrl: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: '',
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
    }],
    comments: [{
        text: { type: String, required: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);