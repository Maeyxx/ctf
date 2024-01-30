const mongoose = require('../database.js');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

// Utiliser la collection 'ctf' pour le modèle User
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;