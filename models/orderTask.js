const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const orderTaskSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    jobType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobType',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const OrderTask = mongoose.model('OrderTask', orderTaskSchema);

function validateOrderTask(orderTask) {
    const schema = Joi.object({
        orderId: Joi.objectId().required(),
        _id: Joi.objectId(),
        jobType: Joi.objectId().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        employee: Joi.objectId()
    });
    return schema.validate(orderTask);
}

exports.OrderTask = OrderTask;
exports.validate = validateOrderTask;