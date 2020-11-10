const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    category: {
        type: String,
        require: true
    }
});
mongoose.model('category', CategorySchema);