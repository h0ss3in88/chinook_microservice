const express = require('express'),
    status = require('http-status'),
    humps = require('humps'),
    validator = require('validator'),
    { check, validationResult } = require('express-validator/check'),
    router = express.Router();
let locales = [ 'ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'ku-IQ', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sl-SI', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA' ];

module.exports = (options) => {
    if (!options.repo) {
        throw new Error('there is no repository');
    }
    router.get('/customers', (req, res, next) => {
        options.repo.getAllCustomers().then((result) => {
            return res.status(status.OK).json(humps.camelizeKeys(result));
        }).catch(next);
    });
    router.post('/customers/search',
        [ check('firstName').not().isNumeric(), check('firstName').not().optional(),
            check('lastName').not().isNumeric(), check('firstName').not().isAlphanumeric(),
            check('lastName').not().isAlphanumeric(), check('firstName').isLength({ 'min': 2 }),
            check('lastName').not().optional(), check('firstName').not().isEmpty(),
            check('lastName').not().isEmpty(), check('firstName').not().optional() ], (req, res, next) => {
            let errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(errors.array());
            }
            options.repo.getCustomerByNames(req.body.firstName, req.body.lastName).then((customer) => {
                return res.status(status.OK).json(humps.camelizeKeys(customer));
            }).catch((err) => {
                return next(err);
            });
        });
    router.param('id', (req, res, next, id) => {
        req.id = id;
        return next();
    });
    router
        .route('/customers/:id')
        .get((req, res, next) => {
            options.repo.getCustomerById(req.id).then((result) => {
                return res.status(status.OK).json(humps.camelizeKeys(result));
            }).catch(next);
        });


    return router;
};
