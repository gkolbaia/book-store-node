const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');

require('../models/author');
require('../models/books');
const AuthorModel = mongoose.model('author');
const BooksModel = mongoose.model('books');
const objectId = mongoose.Types.ObjectId;



router.post('/mainsearch', (req, res) => {
    result = []
    if (req.body.term !== '') {
        BooksModel.find({ name: { $regex: req.body.term.toLowerCase() } }, (err, books) => {
            if (err) {
                console.log(err)
            } else {
                if (books) {
                    books.forEach(book => { result.push(book) });
                };
                AuthorModel.find({ name: { $regex: req.body.term.toLowerCase() } }, (err, authors) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (authors) {
                            authors.forEach(author => { result.push(author) });
                        }
                        res.status(200).send(result.slice(0, 10))
                    };
                });
            };
        });
    } else {
        res.send([])
    }
});
router.post('/getcurrentauthor', (req, res) => {
    AuthorModel.findOne({ name: req.body.name }, (err, author) => {
        if (err) {
            console.log(res);
        } else {
            if (author) {
                res.status(200).send(author);
            } else {
                res.status(404).send({ message: 'could not find this author' })
            }
        }
    });
});
router.post('/getbookbyname', (req, res) => {
    BooksModel.findOne({ name: req.body.name }, (err, book) => {
        if (err) {
            console.log(err);
        } else {
            if (book) {
                res.status(200).send(book)
            } else {
                res.status(404).send({ message: 'cant find book' })
            }
        }
    })
});
router.post('/getbooksbyauthor', (req, res) => {
    BooksModel.find({ "author._id": objectId(req.body._id) }, (err, books) => {
        if (err) {
            console.log(err)
        } else {
            if (books) {
                res.status(200).send(books);
            } else {
                res.status(404).send({ message: 'We don thave Books of this author' })
            }
        }
    })
});
router.post('/getbooksbycategory', (req, res) => {
    BooksModel.find({ categories: { $in: [req.body.categories] } }, (err, books) => {
        if (err) {
            console.log(err)
        } else {
            if (books) {
                res.status(200).send(books);
            } else {
                res.status(404).send({ message: 'could not find books of that category' })
            }
        }
    })
});
router.get('/getbookposter', (req, res) => {
    fs.readFile('./' + req.query.path, (err, data) => {
        res.contentType('image/jpeg');
        res.send(data);
    });
});
router.post('getauthorposter', (req, res) => {
    fs.readFile('./' + req.query.path, (err, data) => {
        res.contentType('image/jpeg');
        res.send(data);
    })
});
router.get('/getbooks', (req, res) => {
    BooksModel.find({}, (err, books) => {
        if (err) {
            res.status(404).send({ message: 'There is no books' });
        } else {
            books.sort((a, b) => {
                return new Date(b.bookAddingDate) - new Date(a.bookAddingDate)
            })
            res.status(200).send(books.slice(0, 10));
        }
    });
});

module.exports = router;