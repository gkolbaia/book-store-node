//mainteresebs sqema erti js pailidan meoreshi rogor gadavitano


const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategoriesSchema = new Schema({
    category: String
},
    {
        _id: false
    });
const AuthorSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    dateOfDeath: {
        type: Date,
        required: false
    },
    categories: {
        type: [CategoriesSchema],
        required: false,
        default: []
    }
},
    {
        _id: false
    })
const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: AuthorSchema,
        required: true
    },
    categories: {
        type: [CategoriesSchema],
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
    description: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: false
    },
    bookAddingDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    posterPath: {
        type: String,
        required: true,
    }
});
mongoose.model('books', bookSchema);
