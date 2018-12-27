const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_STRING,{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

module.exports = {
    mongoose
}