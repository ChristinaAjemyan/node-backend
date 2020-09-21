const { JobType, validate } = require('../models/jobType');
const auth = require('../middlewares/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Response = require('../middlewares/response');

router.get('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const jobTypes = await JobType.find();
    api_response({ jobTypes: jobTypes });
});

router.post('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);
    const jobType = new JobType(_.pick(req.body, ['value']));
    await jobType.save();
    api_response({ item: jobType });
});

router.get('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let jobType = await JobType.findById(req.params.id);
    if (!jobType) return api_response(null, 'Job type with given id not found');
    api_response({ jobType: jobType });
});

router.put('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let jobType = await JobType.findById(req.params.id);
    if (!jobType) return api_response(null, 'Job type with given id not found');

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: [error.details[0].message] });

    jobType.set(_.pick(req.body, ['value']));
    const result = await jobType.save();
    api_response({ jobType: result });
});

router.delete('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let result = await JobType.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'Job type with given id not found');

    api_response({ message: 'Job type removed successfully' });
});

module.exports = router;