const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


require('../models/author')
const AuthorModel = mongoose.model('author')


router.post('/addAuthor', (req, res) => {

});
module.exports = router