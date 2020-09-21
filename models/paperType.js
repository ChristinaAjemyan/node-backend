const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const paperTypeSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
});

const PaperType = mongoose.model('PaperType', paperTypeSchema);

function validatePaperType(paperType) {
    const schema = Joi.object({
        value: Joi.string().required(),
        _id: Joi.objectId()
    });
    return schema.validate(paperType);
}

exports.PaperType = PaperType;
exports.validate = validatePaperType;