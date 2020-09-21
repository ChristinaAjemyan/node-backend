const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const jobTypeSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
});

const JobType = mongoose.model('JobType', jobTypeSchema);

function validateJobType(jobType) {
    const schema = Joi.object({
        value: Joi.string().required(),
        _id: Joi.objectId()
    });
    return schema.validate(jobType);
}

exports.JobType = JobType;
exports.validate = validateJobType;