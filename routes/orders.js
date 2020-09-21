const { Order, validate } = require('../models/order');
const { OrderTask } = require('../models/orderTask');
const { PaperType } = require('../models/paperType');
const { PaperWeight } = require('../models/paperWeight');
const { OrderStatus } = require('../models/orderStatus');
const { JobType } = require('../models/jobType');
const auth = require('../middlewares/auth');
const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const config = require('config');
const Response = require('../middlewares/response');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const orders = await Order.find().populate('partner');
    api_response({ orders: orders });
});

router.post('/', auth, upload.array('designFiles', 12), async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);
    order = new Order(_.pick(req.body, _.keys(req.body)));
    let files = req.files.map(el => {
        return {
            name: el.originalname,
            url: `${config.get('serverUrl')}/uploads/${el.filename}`,
            size: el.size
        };
    });
    order.designFiles = files;
    await order.save();
    api_response({ order: await Order.populate(order, { path: 'partner' }) });

});

router.post('/delete-file', auth, async (req, res) => {
    const api_response = Response(req, res);
    if (!req.body.file_id) return api_response(null, "file_id is required");

    let order = await Order.findOne({ "designFiles": { $elemMatch: { _id: req.body.file_id } } });
    let filePath = order.designFiles.find(el => el._id == req.body.file_id).url.replace(config.get('serverUrl'), '');
    fs.unlink(`./public${filePath}`, (err) => {
        if (err) return api_response(null, err);
        order.designFiles = order.designFiles.filter(el => el._id != req.body.file_id);
        order.save();
        api_response({ order: order });
    });
});
router.get('/details-info', auth, async (req, res) => {
    const api_response = Response(req, res);
    let paperTypes = await PaperType.find();
    let paperWeights = await PaperWeight.find();
    let orderStatuses = await OrderStatus.find();
    let jobTypes = await JobType.find();
    api_response({
        paperTypes: paperTypes,
        paperWeights: paperWeights,
        orderStatuses: orderStatuses,
        jobTypes: jobTypes
    });
});

router.get('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let order = await Order
        .findById(req.params.id)
        .populate('partner');
    if (!order) return api_response(null, 'The Order with given id not found');
    let orderTasks = await OrderTask.find({ orderId: req.params.id }).populate('jobType').populate({ path: 'employee', select: '-password' });
    order = Object.assign(order.toObject(), { tasks: orderTasks });
    api_response({ order: order });
});

router.put('/:id', auth, upload.array('designFiles', 12), async (req, res) => {
    const api_response = Response(req, res);
    let order = await Order.findById(req.params.id);
    if (!order) return api_response(null, 'The Order with given id not found');
    if (typeof req.body.partner === "object") {
        req.body.partner = req.body.partner._id;
    }
    // const { error } = validate(req.body); 
    // if (error) return api_response(null, error.details[0].message);
    let files;
    if (req.files) {
        files = req.files.map(el => {
            return {
                name: el.originalname,
                url: `${config.get('serverUrl')}/uploads/${el.filename}`,
                size: el.size
            };
        });
    }
    order.set(req.body);
    order.designFiles = files;
    const result = await order.save();
    api_response({ order: await Order.populate(result, { path: 'partner' }) });
});

router.delete('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let result = await Order.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'The Order with given id not found');
    api_response({ message: 'Order is successfully deleted' });

});


module.exports = router;