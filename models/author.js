const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CategoriesSchema = new Schema({
    category: {
        type: String,
        required: true
    }
},
    {
        _id: false
    })

const AuthorSchema = new Schema({
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
    },
    imagePath: {
        type: String,
        required: false,
        default: ''
    }
});
mongoose.model('author', AuthorSchema);