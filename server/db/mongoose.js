var mongoose = require ('mongoose');

mongoose.Promise = global.Promise;

// Have to see mongo DB appropriately if this on Heroku
mongoose.connect('mongodb://admin:admin@ds161022.mlab.com:61022/jdeusers-tracker',{
    useMongoClient: true
});

module.exports = {mongoose};