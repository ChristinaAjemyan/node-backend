const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 1024
    },
    phoneNumber: String,
    isAdmin: {
        type: Boolean,
        default: true
    },
    salary: String,
    position: String,
    role: String
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(6).max(1024),
        phoneNumber: Joi.string(),
        isAdmin: Joi.boolean(),
        _id: Joi.objectId(),
        salary: Joi.string(),
        position: Joi.string(),
        role: Joi.string(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;