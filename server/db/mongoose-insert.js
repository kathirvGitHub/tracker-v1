
const { User } = require('./../models/user');

var { mongoose } = require('./mongoose');

var newJDEuser = new User({
    jdeUsername: 'KPANDURANG',
    jdePassword: 'Dec2015!'
});

newJDEuser.save().then((doc) => {
    console.log(doc);
}, (e) => {
    console.log(e);
});