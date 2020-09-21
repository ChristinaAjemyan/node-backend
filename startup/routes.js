const error = require('../middlewares/error');
const cors = require('cors');
const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const partners = require('../routes/partners');
const orders = require('../routes/orders');
const jobTypes = require('../routes/jobTypes');
const orderTasks = require('../routes/orderTasks');
const paperTypes = require('../routes/paperTypes');
const paperWeight = require('../routes/paperWeights');
const orderStatus = require('../routes/orderStatuses');

module.exports = function (app) {
    //Routes
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/partners', partners);
    app.use('/api/orders', orders);
    app.use('/api/job-types', jobTypes);
    app.use('/api/order-tasks', orderTasks);
    app.use('/api/paper-types', paperTypes);
    app.use('/api/paper-weights', paperWeight); 
    app.use('/api/order-statuses', orderStatus); 
    app.use(error);
};