const express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    responseTime = require('response-time'),
    errorHandler = require('errorhandler'),
    api = require('./api');

const start = (options) => {
    return new Promise((resolve,reject) => {
        if(!options.repo){
            return reject('open connection needed');
        }
        if(!options.micro_port){
            return reject('port number needed');
        }
        const app = express();
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : true }));
        app.use(compression());
        app.use(responseTime());
        app.set('port',options.micro_port);
        app.get('/favicon.ico', (req, res) => res.status(204));
        api(app,options);
        app.use((req,res,next) => {
            let err = new Error('not found');
            return next(err);
        });
        app.use(errorHandler());
        return resolve(app);
    });
}

module.exports = Object.assign({},{start});