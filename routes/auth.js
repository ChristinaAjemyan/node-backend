const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const Response = require('../middlewares/response');


router.post('/', async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return api_response(null, 'Invalid email or password');
    if (!user.password) return api_response(null, 'This user has no login permission');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return api_response(null, 'Invalid email or password');
    const token = user.generateAuthToken();
    api_response({ token: token });
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(6).max(1024).required()
    });
    return schema.validate(req);
}

module.exports = router;