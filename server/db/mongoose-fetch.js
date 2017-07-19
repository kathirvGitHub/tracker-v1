
const { User } = require('./../models/user');
var { mongoose } = require('./mongoose');


User.find().then((users) => {
    console.log({ users });
}, (e) => {
    console.log(e);
});