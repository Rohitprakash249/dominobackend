const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'A User must have a name'],
    },
    email: {
        type: String,
        required: [true,'A User must have a email'],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, 'A User must have a phone number'],
        unique: true,
    },
    password :{
        type: String,
        required: [true, 'A User must have a password'],
        select: false,
    },
    addresses: {
        type: Array,
        required: false,
    },
    selectedAddress: {
        type: Object,
        required: false,
    },
    cartItems: {
        type: Array,
        required: false,
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;