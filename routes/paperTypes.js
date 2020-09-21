const { PaperType, validate } = require('../models/paperType');
const auth = require('../middlewares/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Response = require('../middlewares/response');

router.get('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const paperTypes = await PaperType.find();
    api_response({ paperTypes: paperTypes });
});

router.post('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);
    const paperType = new PaperType(_.pick(req.body, ['value']));
    await paperType.save();
    api_response({ item: paperType });
});

router.get('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let paperType = await PaperType.findById(req.params.id);
    if (!paperType) return api_response(null, 'Paper type with given id not found');
    api_response({ paperType: paperType });
});

router.put('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let paperType = await PaperType.findById(req.params.id);
    if (!paperType) return api_response(null, 'Paper type with given id not found');

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: [error.details[0].message] });

    paperType.set(_.pick(req.body, ['value']));
    const result = await paperType.save();
    api_response({ paperType: result });
});

router.delete('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let result = await PaperType.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'Paper type with given id not found');

    api_response({ message: 'Paper type removed successfully' });
});

module.exports = router;