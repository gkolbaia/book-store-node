//mainteresebs sqema erti js pailidan meoreshi rogor gadavitano

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const getUserId = require('../helpers/getUserId');
const verifyToken = require('../helpers/verify');

require('../models/User');
require('../models/admin');
const UserModel = mongoose.model('users');
const AdminModel = mongoose.model('admin');
const objectId = mongoose.Types.ObjectId;

router.post('/registration', (req, res) => {
    UserModel.findOne({ userName: req.body.userName }, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            if (user) {
                res.status(401).send({ message: 'This user name already exist' })
            } else {
                var newUser = req.body;
                newUser.status = 'user';
                bcrypt.hash(newUser.password, 6, (err, hash) => {
                    newUser.password = hash;
                    bcrypt.hash(newUser.status, 6)
                        .then(hashedStatus => {
                            // newUser.status = hashedStatus
                            new UserModel(newUser)
                                .save()
                                .then(registeredUser => {
                                    let payload = { userId: registeredUser._id }
                                    let token = jwt.sign(payload, 'SecretKey')
                                    res.status(200).send({ token: token, user: registeredUser });
                                });
                        })

                });
            };
        };
    });
});
router.post('/login', (req, res) => {
    UserModel.findOne({ userName: req.body.userName }, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(matched => {
                        if (matched) {
                            let payload = { userId: user._id };
                            let token = jwt.sign(payload, 'SecretKey');
                            res.status(200).send({ token: token, user: user });
                        } else {
                            res.status(401).send({ message: 'Wrong Password' })
                        }
                    })
                    .catch(err => console.log(err))
            } else {
                AdminModel.findOne({ userName: req.body.userName })
                    .then(admin => {
                        if (admin) {
                            bcrypt.compare(req.body.password, admin.password)
                                .then(matched => {
                                    if (matched) {
                                        let payload = { userId: admin._id }
                                        let token = jwt.sign(payload, 'SecretKey');
                                        res.status(200).send({ token: token, user: admin })
                                    }
                                })
                        } else {
                            res.status(401).send({ message: 'Invalid User Name' })
                        }
                    }).catch(err => console.log(err));

            }
        }
    })
});
router.get('/sada', verifyToken.verifyToken, (req, res) => {
    var admin = {
        userName: 'giorgikolbaia',
        password: '12345',
        status: 'admin'
    };
    bcrypt.hash(admin.status, 6, (err, hashedStatus) => {
        if (err) {
            console.log(err);
        } else {
            // admin.status = hashedStatus;
            bcrypt.hash(admin.password, 6, (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                } else {
                    admin.password = hashedPassword;
                    new AdminModel(admin)
                        .save()
                        .then(admin => {
                            res.status(200).send(admin);
                        });
                };
            });
        };
    });
});
router.get('/getLoggedInUser', verifyToken.verifyToken, (req, res) => {
    const id = getUserId(req, res);
    AdminModel.findOne({ _id: objectId(id) }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                res.status(200).send({ user: user, status: user.status });
            } else {
                UserModel.findOne({ _id: objectId(id) }, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if (user) {
                            res.status(200).send({ user: user, status: user.status });
                        } else {
                            res.status(401).send({ message: 'not user neither admin' })
                        }
                    }
                })
            };
        };
    });
});
module.exports = router;