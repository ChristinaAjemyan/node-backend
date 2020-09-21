const { OrderStatus, validate } = require('../models/orderStatus');
const auth = require('../middlewares/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Response = require('../middlewares/response');

router.get('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const orderStatuses = await OrderStatus.find();
    api_response({ orderStatuses: orderStatuses });
});

router.post('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);
    const orderStatus = new OrderStatus(_.pick(req.body, ['value']));
    await orderStatus.save();
    api_response({ item: orderStatus });
});

router.get('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let orderStatus = await OrderStatus.findById(req.params.id);
    if (!orderStatus) return api_response(null, 'Order status with given id not found');
    api_response({ orderStatus: orderStatus });
});

router.put('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let orderStatus = await OrderStatus.findById(req.params.id);
    if (!orderStatus) return api_response(null, 'Order status with given id not found');

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: [error.details[0].message] });

    orderStatus.set(_.pick(req.body, ['value']));
    const result = await orderStatus.save();
    api_response({ orderStatus: result });
});

router.delete('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let result = await OrderStatus.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'Order status with given id not found');

    api_response({ message: 'Order status removed successfully' });
});

module.exports = router;