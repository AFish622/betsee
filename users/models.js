'use strict'

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promose = global.Promise;

const UserSchema = mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    }
});

UserSchema.methods.serialize = function() {
    return {
        // check the expression, may only need to return username
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    }
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, 10);
}

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };