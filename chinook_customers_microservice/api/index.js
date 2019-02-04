const customers = require('./lib/customers'),
    ping = require('./lib/ping');

module.exports = (app, options) => {
    app.use('/api', ping());
    app.use('/api', customers(options));
};
