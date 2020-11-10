//mainteresebs sqema erti js pailidan meoreshi rogor gadavitano

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BoughtBookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sale: {
        type: Number,
        required: false,
        default: 0
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    },
    boughtTime: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, { _id: false });
const wishListBook = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sale: {
        type: Number,
        required: false,
        default: 0
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    }
}, { _id: false });
const cardSchema = new Schema({
    bank: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    }
}, { _id: false });
UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    boughtBooks: {
        type: [BoughtBookSchema],
        required: true,
        default: []
    },
    cardModels: {
        type: [cardSchema],
        required: true,
        default: []
    },
    status: {
        type: String,
        required: true
    },
    wishList: {
        type: [wishListBook],
        required: true,
        default: []
    }
});
mongoose.model('users', UserSchema)