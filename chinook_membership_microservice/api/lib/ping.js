const express = require('express'),
    status = require('http-status'),
    router = express.Router();

module.exports = () => {
    router
        .route('/accounts/ping')
        .get((req, res) => {
            return res.status(status.OK).json({ 'ping': 'pong' });
        });
    return router;
};
