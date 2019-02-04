const express = require('express'),
    status = require('http-status'),
    router = express.Router();

module.exports = (options) => {
    if (!options.repo) {
        throw new Error('there is no repository');
    }
    router.get('/movies', (req, res, next) => {
        options.repo.getAllCustomers().then((result) => {
            return res.status(status.OK).json(result);
        }).catch(next);
    });
    router.get('/movies/:id/actors', (req, res, next) => {
        options.repo.getAllCustomers().then((result) => {
            return res.status(status.OK).json(result);
        }).catch(next);
    });
    router.param('id', (req, res, next, id) => {
        req.id = id;
        return next();
    });
    router
        .route('/movies/:id')
        .get((req, res, next) => {
            options.repo.getCustomerById(req.id).then((result) => {
                return res.status(status.OK).json(result);
            }).catch(next);
        });
    return router;
};
