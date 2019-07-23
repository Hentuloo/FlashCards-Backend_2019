var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;
