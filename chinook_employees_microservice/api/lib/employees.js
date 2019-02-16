/* eslint-disable one-var */
const express = require('express'),
    status = require('http-status'),
    { decamelizeKeys } = require('humps'),
    newEmployeeValidation = require('../../utilities/middlewares/employees'),
    router = express.Router();

module.exports = (options) => {
    if (!options.repo) {
        throw new Error('there is no repository');
    }
    router.get('/employees', (req, res, next) => {
        console.log(req.container.resolve('repo'));
        options.repo.getAllEmployees().then((result) => {
            return res.status(status.OK).json(result);
        }).catch(next);
    });
    router.post('/employees/search', (req, res, next) => {
        options.repo.getEmployeeByNames(req.body.firstName, req.body.lastName).then((result) => {
            return res.status(status.OK).json(result);
        }).catch((err) => {
            return next(err);
        });
    });
    router.post('/employees/search/country', (req, res, next) => {
        options.repo.getEmployeeByCountry(req.body.country).then((result) => {
            return res.status(status.OK).json(result);
        }).catch((err) => {
            return next(err);
        });
    });
    router.post('/employees', newEmployeeValidation, (req, res, next) => {
        options.repo.createEmployee(decamelizeKeys(req.employee.save())).then((result) => {
            return res.status(status.CREATED).json(result);
        }).catch((err) => {
            return next(err);
        });
    });
    router.param('id', (req, res, next, id) => {
        req.id = id;
        return next();
    });
    router
        .route('/employees/:id')
        .get((req, res, next) => {
            options.repo.getEmployeeById(req.id).then((result) => {
                return res.status(status.OK).json(result);
            }).catch(next);
        })
        .put((req, res, next) => {
            options.repo.updateEmployee(req.id, req.body).then((result) => {
                return res.status(status.ACCEPTED).json(result);
            }).catch((err) => {
                return next(err);
            });
        })
        .delete((req, res, next) => {
            options.repo.deleteEmployee(req.id).then((result) => {
                return res.status(status.ACCEPTED).json(result);
            }).catch((err) => {
                return next(err);
            });
        });
    return router;
};
