const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const partnerSchema = new mongoose.Schema({
    companyName: {
        type: String,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    phoneNumber: {
        type: String
    }
});

const Partner = mongoose.model('Partner', partnerSchema);

function validatePartner(partner) {
    const schema = Joi.object({
        companyName: Joi.string(),
        email: Joi.string().email(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string(),
        _id: Joi.objectId()
    });
    return schema.validate(partner);
}

exports.Partner = Partner;
exports.validate = validatePartner;