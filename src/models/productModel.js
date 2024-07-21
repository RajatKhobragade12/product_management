const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true

    },
    rate: {
        type: Number,
        required: true

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    pdf:{
        type: String,
    }
}, { timestamps: true });


module.exports = mongoose.model('product', productSchema);