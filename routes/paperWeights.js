const { PaperWeight, validate } = require('../models/paperWeight');
const auth = require('../middlewares/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Response = require('../middlewares/response');

router.get('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const paperWeights = await PaperWeight.find();
    api_response({ paperWeights: paperWeights });
});

router.post('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);
    const paperWeight = new PaperWeight(_.pick(req.body, ['value']));
    await paperWeight.save();
    api_response({ item: paperWeight });
});

router.get('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let paperWeight = await PaperWeight.findById(req.params.id);
    if (!paperWeight) return api_response(null, 'Paper weight with given id not found');
    api_response({ paperWeight: paperWeight });
});

router.put('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let paperWeight = await PaperWeight.findById(req.params.id);
    if (!paperWeight) return api_response(null, 'Paper weight with given id not found');

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: [error.details[0].message] });

    paperWeight.set(_.pick(req.body, ['value']));
    const result = await paperWeight.save();
    api_response({ paperWeight: result });
});

router.delete('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let result = await PaperWeight.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'Paper weight with given id not found');

    api_response({ message: 'Paper weight removed successfully' });
});

module.exports = router;