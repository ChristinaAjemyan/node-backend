const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const ordersSchema = new mongoose.Schema({
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    description: String,
    requestedDeadline: {
        type: Date
    },
    deadline: {
        type: Date,
        // default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
    },
    sizes: {
        type: String,
    },
    sizeOfEach: {
        type: String
    },
    paperType: {
        type: String,
    },
    paperWeight: {
        type: String,
    },
    amount: {
        type: Number,
    },
    preferredPrice: {
        type: Number,
    },
    priceForEach: {
        type: Number,
    },
    orderStatus: {
        type: String,
    },
    status: {
        type: Number,
    },
    paymentMethods: {
        type: String,
        // default: 'Cash',
        // enum: ['Cash', 'Card']
    },
    isPayed: {
        type: Boolean,
        // default: false
    },
    designFiles: [
        {
            name: String,
            url: String,
            size: String
        }
    ]
});


const Order = mongoose.model('Order', ordersSchema);

function validateOrder(order) {
    const schema = Joi.object({
        partner: Joi.objectId().required(),
        description: Joi.string().allow(''),
        requestedDeadline: Joi.string().allow(''),
        deadline: Joi.string().allow(''),
        sizes: Joi.string().allow(''),
        sizeOfEach: Joi.string().allow(''),
        amount: Joi.string().allow(''),
        preferredPrice: Joi.string().allow(''),
        priceForEach: Joi.string().allow(''),
        status: Joi.string().allow(''),
        paymentMethods: Joi.string().allow(''),
        isPayed: Joi.boolean().allow(''),
        _id: Joi.objectId(),
        paperType: Joi.string().allow(''),
        paperWeight: Joi.string().allow(''),
        orderStatus: Joi.string().allow('')
    });
    return schema.validate(order);
}

exports.Order = Order;
exports.validate = validateOrder;