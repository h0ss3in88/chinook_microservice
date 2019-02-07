const auth = require('./lib/authentication'),
    ping = require('./lib/ping');

module.exports = (app, options) => {
    app.use('/api', ping());
    app.use('/api', auth(options));
};
