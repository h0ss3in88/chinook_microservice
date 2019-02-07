/* eslint-disable keyword-spacing */
const express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    responseTime = require('response-time'),
    errorHandler = require('errorhandler'),
    api = require('./api'),
    passportConfig = require('./configs/passportConfig'),
    start = (options) => {
        return new Promise((resolve, reject) => {
            if (!options.repo) {
                return reject(new Error('open connection needed'));
            }
            if (!options.microPort) {
                return reject(new Error('port number needed'));
            }
            const app = express();

            app.use(logger('dev'));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ 'extended': true }));
            app.use(compression());
            app.use(responseTime());
            app.set('port', options.microPort);
            app.get('/favicon.ico', (req, res) => res.status(204));
            passportConfig(options.repo);
            api(app, options);
            app.use((req, res, next) => {
                let err = new Error('not found');

                return next(err);
            });
            app.use(errorHandler());
            return resolve(app);
        });
    };

module.exports = Object.assign({}, { start });
