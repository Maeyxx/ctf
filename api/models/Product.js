const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    // Autres champs liés aux produits...
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;