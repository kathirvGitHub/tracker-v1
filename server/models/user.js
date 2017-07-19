var mongoose = require('mongoose');

var User = mongoose.model('User' ,{
    jdeUsername: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    jdePassword: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    }
})

module.exports = { User };
