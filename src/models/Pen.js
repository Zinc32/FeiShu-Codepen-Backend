const mongoose = require('mongoose');

const penSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    html: {
        type: String,
        default: ''
    },
    css: {
        type: String,
        default: ''
    },
    js: {
        type: String,
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pen', penSchema); 