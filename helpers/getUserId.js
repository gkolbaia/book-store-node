const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    let token = req.headers.authorization.split(' ')[1];
    if (!token === 'null') {
        return res.status(401).send('Unauthorized request')
    };
    let payload = jwt.verify(token, 'SecretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }
    return payload.userId
}