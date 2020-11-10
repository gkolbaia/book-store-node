const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
require('../models/admin');

const AdminModel = mongoose.model('admin');
const objectId = mongoose.Types.ObjectId;
var verifyToken = function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    };
    let payload = jwt.verify(token, 'SecretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}
const verifyAdmin = function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    };
    let payload = jwt.verify(token, 'SecretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}
module.exports = { verifyToken: verifyToken }