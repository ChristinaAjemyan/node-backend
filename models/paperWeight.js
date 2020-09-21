const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const paperWeightSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
});

const PaperWeight = mongoose.model('PaperWeight', paperWeightSchema);

function validatePaperWeight(paperWeight) {
    const schema = Joi.object({
        value: Joi.string().required(),
        _id: Joi.objectId()
    });
    return schema.validate(paperWeight);
}

exports.PaperWeight = PaperWeight;
exports.validate = validatePaperWeight;