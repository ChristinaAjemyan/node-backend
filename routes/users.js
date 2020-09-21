const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const Response = require('../middlewares/response');



router.get('/me', auth, async (req, res) => {
    const api_response = Response(req, res);
    const user = await User.findById(req.user._id).select('-password');
    api_response({ data: user });
});

router.get('/', auth, async (req, res) => {
    const api_response = Response(req, res);
    const users = await User.find().select('firstName lastName email phoneNumber');
    api_response({ users: users });
});

router.post('/', [auth, admin], async (req, res) => {
    const api_response = Response(req, res);
    const { error } = validate(req.body);
    if (error) return  api_response(null, error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return api_response(null, "User with that email already exist");

    if (req.body.password) {
        user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } else {
        user = new User(req.body);
    }

    await user.save();

    api_response({ user: user });
});

router.get('/:id', [auth, admin], async (req, res) => {
    const api_response = Response(req, res);
    let user = await User.findById(req.params.id);
    if (!user) return  api_response(null, 'The User with given id not found');
    api_response({user: user});
});

router.put('/:id', [auth, admin], async (req, res) => {
    const api_response = Response(req, res);
    let user = await User.findById(req.params.id);
    if (!user) return  api_response(null, 'The User with given id not found');

    const { error } = validate(req.body);
    if (error) return api_response(null, error.details[0].message);

    if (req.body.password) {
        user.set(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } else {
        user.set(req.body);
    }    
    const result = await user.save();
    api_response({user: result});
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const api_response = Response(req, res);
    let result = await User.findByIdAndRemove(req.params.id);
    if (!result) return api_response(null, 'The User with given id not found');
    api_response({message: 'User successfully deleted.'});
});

module.exports = router;