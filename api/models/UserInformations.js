const mongoose = require('../database.js');

const userInformationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    postalcode: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

// Utiliser la collection 'ctf' pour le modèle User
const UserInformations = mongoose.model('UserInformations', userInformationSchema, 'users_informations');

module.exports = UserInformations;