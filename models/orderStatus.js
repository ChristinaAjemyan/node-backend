const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const orderStatusSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
});

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);

function validateOrderStatus(orderStatus) {
    const schema = Joi.object({
        value: Joi.string().required(),
        _id: Joi.objectId()
    });
    return schema.validate(orderStatus);
}

exports.OrderStatus = OrderStatus;
exports.validate = validateOrderStatus;