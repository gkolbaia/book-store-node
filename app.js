//mainteresebs sqema erti js pailidan meoreshi rogor gadavitano
const express = require('express');
const mongoose = require('mongoose');
const bodyParsaer = require('body-parser');
const cors = require('cors');
const verifyToken = require('./helpers/verify');







const app = express();
app.use(cors());
app.use(bodyParsaer.json());
app.use(bodyParsaer.urlencoded({ extended: true }));
app.use(express.static('./public'));

const Admin = require('./routes/Admin');
const Authentication = require('./routes/authentication');
const Authors = require('./routes/author');
const User = require('./routes/user');


mongoose.connect('mongodb://192.168.4.169/gio-test-4-bookStore', { useNewUrlParser: true });


//wasashleli
app.get('/', (req, res) => {
    res.send('sada')
});

app.use('/admin', Admin);
app.use('/authentication', Authentication);
app.use('/author', Authors);
app.use('/user', User);
app.use('/admin', verifyToken.verifyToken);
const port = 5000;
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
});