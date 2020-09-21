const { OrderTask, validate } = require('../models/orderTask');
const { Order } = require('../models/order');
const auth = require('../middlewares/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Response = require('../middlewares/response');

router.get('/?', auth, async (req, res) => {
    const api_response = Response(req, res);
    const orderTasks = await OrderTask.find(req.query).populate('jobType').populate({ path: 'employee', select: '-password' });
    api_response({ orderTasks: orderTasks });
});

router.post('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);
    let order = await Order.findById(req.body.orderId);
    if (order && !order.deadline || req.body.endDate > order.deadline) {
        order.deadline = req.body.endDate;
        await order.save();
    }
    orderTask = new OrderTask(req.body);
    await orderTask.save();
    api_response({ orderTask: await OrderTask.populate(orderTask, [{ path: 'jobType' }, { path: 'employee', select: '-password' }]) });
});

router.get('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let orderTask = await OrderTask.findById(req.params.id);
    if (!orderTask) return api_response(null, 'The Order Tasks with given id not found');
    api_response({ orderTask: orderTask });
});

router.put('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let orderTask = await OrderTask.findById(req.params.id);
    if (!orderTask) return api_response(null, 'The Order Tasks with given id not found');
    if (typeof req.body.jobType === "object") {
        req.body.jobType = req.body.jobType._id;
    }
    if (typeof req.body.employee === "object") {
        req.body.employee = req.body.employee._id;
    }
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);

    orderTask.set(req.body);
    const result = await orderTask.save();
    api_response({ orderTask: await OrderTask.populate(result, [{ path: 'jobType' }, { path: 'employee', select: '-password' }]) });
});

router.delete('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let result = await OrderTask.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'The Order Tasks with given id not found');

    api_response({ message: 'Order Tasks removed successfully' });
});

module.exports = router;