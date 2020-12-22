const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    First_Name:{
        type: String,
        required: true
    },
    Last_Name:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    // avatar:{
    //     tyoe: String,
    //     required: false
    // },
    Date: {
        type: Date,
        default: Date.now
    }
});


module.exports = User = mongoose.model('users', UserSchema);