const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multipart = require('multiparty')
const readChunk = require('read-chunk')
const fileType = require('file-type');
const fs = require('fs')


require('../models/books');
const BookModel = mongoose.model('books');
require('../models/categories');
const CategoryModel = mongoose.model('category');
require('../models/author');
const AuthorModel = mongoose.model('author');
const upload = require('../helpers/imageUpload');
const fileChecker = require('../helpers/fileChecker')
const objectId = mongoose.Types.ObjectId;



router.get('/getBooks', (req, res) => {
    BookModel.find({}, (error, books) => {
        if (error) {
            console.log(error);
        } else {
            if (books) {
                res.status(200).send(books);
            } else {
                res.status(404).send({ message: 'Cant Find Books' })
            };
        };
    });
});
router.post('/getauthor', (req, res) => {
    AuthorModel.findById({ _id: objectId(req.body._id) }, (err, author) => {
        if (err) {
            console.log(err);
        } else {
            if (author) {
                res.status(200).send(author);
            } else {
                res.status(404).send({ message: 'author not found' })
            }
        }
    })
});
router.post('/getbookbyid', (req, res) => {
    BookModel.findById({ _id: objectId(req.body._id) }, (err, book) => {
        if (err) {
            console.log(err);
        } else {
            if (book) {
                res.status(200).send(book);
            } else {
                res.status(404).send({ message: 'author not found' })
            }
        }
    })
})
router.get('/getBookCategories', (req, res) => {
    CategoryModel.find({}, (err, categories) => {
        if (err) {
            console.log(err);
        } else {
            if (categories) {
                res.status(200).send(categories)
            } else {
                res.status(404).send({ message: 'cant find categories ' })
            }
        }
    });
});
router.post('/addauthor', (req, res) => {
    AuthorModel.findOne({ name: req.body.name }, (err, author) => {
        if (err) {
            console.log(err);
        } else {
            if (author) {
                res.status(409).send({ message: 'This author already exists' })
            } else {
                new AuthorModel(req.body)
                    .save()
                    .then(author => { res.status(200).send(author) });
            }
        }
    });
});
router.get('/getauthors', (req, res) => {
    AuthorModel.find({})
        .then(authors => { res.status(200).send(authors); })
        .catch(err => console.log(err));
});
router.post('/addbook', (req, res) => {
    var form = new multipart.Form();
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else if (req.file == undefined) {
            console.log('undefined');
        } else {
            var bookToSave = JSON.parse(req.body.book);
            bookToSave.posterPath = req.file.path;
            BookModel.findOne({ name: bookToSave.name }, (err, book) => {
                if (err) {
                    console.log(err)
                } else if (book) {
                    res.status(409).send({ message: 'book already exists' })
                } else {
                    new BookModel(bookToSave)
                        .save()
                        .then(book => res.status(200).send(book))
                }
            })
        }
    });
});
router.post('/autorSearch', (req, res) => {
    if (req.body.term !== '') {
        AuthorModel.find({ name: { $regex: req.body.term.toLowerCase() } }, (err, authors) => {
            if (err) { } else {
                if (authors) {
                    res.json(authors);
                };
            };
        });
    } else {
        res.json([]);
    }

});
router.post('/saveauthorposter', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(403).send({ message: err });
        } else {
            if (req.file == undefined) {
                console.log('undefined');
            } else {
                AuthorModel.findOne({ name: req.file.originalname.split('.')[0] }, (err, author) => {
                    if (err) {
                        console.log(err);
                    } else {
                        author.imagePath = req.file.path;
                        author.save()
                    }
                });
                res.send(req.file);
            }
        }
    });
});
router.post('/editauthor', (req, res) => {
    AuthorModel.findById(objectId(req.body._id), (err, author) => {
        if (err) {
            console.log(err);
        } else {
            if (!author) {
                res.status(404).send({ message: 'Something went wrong, we can not find that author' });
            } else {
                for (const key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        if (key !== '_id') {
                            author[key] = req.body[key];
                        }
                    }
                }
                author.save((err, savedAuthor) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).send(savedAuthor)
                    }
                });
            }
        }
    })
});
router.post('/editauthorposter', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            if (req.file == undefined) {
                console.log('undefined');
            } else {
                AuthorModel.findOne({ name: req.file.originalname.split('.')[0] }, (err, author) => {
                    if (err) {
                        console.log(err);
                    } else {
                        author.imagePath = req.file.path;
                        author.save()
                    }
                });
                res.status(200).send(req.file)
            }
        }
    });
});
router.post('/editbook', (req, res) => {
    BookModel.findById(objectId(req.body._id), (err, book) => {
        if (err) {
            console.log(err);
        } else {
            if (!book) {
                res.status(404).send({ message: 'Something went wrong,we can not find that book' });
            } else {
                for (const key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        if (key !== '_id') {
                            book[key] = req.body[key]
                        }
                    }
                };
                book.save((err, editedBook) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).send(editedBook);
                    }
                })
            }
        }
    })
});
router.post('/editbookposter', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            if (req.file == undefined) {
                console.log('undefined');
            } else {
                BookModel.findOne({ name: req.file.originalname.split('.')[0] }, (err, book) => {
                    if (err) {
                        console.log(err);
                    } else {
                        book.posterPath = req.file.path;
                        book.save()
                    }
                });
                res.status(200).send(req.file)
            }
        }
    });
});
module.exports = router;