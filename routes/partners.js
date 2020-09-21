const { Partner, validate } = require('../models/partner');
const auth = require('../middlewares/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Response = require('../middlewares/response');

router.get('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const partners = await Partner.find();
    api_response({partners: partners});
});

router.post('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);
    const partner = new Partner(_.pick(req.body, ['companyName', 'email', 'firstName', 'lastName', 'phoneNumber']));
    await partner.save();
    api_response({partner: partner});
});

router.get('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let partner = await Partner.findById(req.params.id);
    if (!partner) return  api_response(null, 'The Partner with given id not found');
    api_response({partner: partner});
});

router.put('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let partner = await Partner.findById(req.params.id);
    if (!partner) return  api_response(null, 'The Partner with given id not found');

    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);

    partner.set(_.pick(req.body, ['companyName', 'email',  'firstName', 'lastName', 'phoneNumber']));
    const result = await partner.save();
    api_response({partner: result});
});

router.delete('/:id', auth, async (req, res) => {
    const api_response = Response(req, res);
    let result = await Partner.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'The Partner with given id not found');
    api_response({message: 'Partner successfully deleted.'});
});

module.exports = router;