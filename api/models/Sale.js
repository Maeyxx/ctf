const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;