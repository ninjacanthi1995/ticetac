const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password: String,
    journeys: [{type: mongoose.Schema.Types.ObjectId, ref: 'journeys'}]
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;