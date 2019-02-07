const express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    responseTime = require('response-time'),
    errorHandler = require('errorhandler'),
    api = require('./api'),

    start = (container) => {
        return new Promise((resolve, reject) => {
            if (!container.resolve('repo')) {
                return reject(new Error('open connection needed'));
            }
            if (!container.resolve('microPort')) {
                return reject(new Error('port number needed'));
            }
            const app = express();

            app.use(logger('dev'));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ 'extended': true }));
            app.use(compression());
            app.use(responseTime());
            app.set('x-powered-by', false);
            app.set('port', container.resolve('microPort'));
            app.get('/favicon.ico', (req, res) => res.status(204));
            api(app, { 'repo': container.resolve('repo') });
            app.use((req, res, next) => {
                let err = new Error('not found');

                return next(err);
            });
            app.use(errorHandler());
            return resolve(app);
        });
    };

module.exports = Object.assign({}, { start });
