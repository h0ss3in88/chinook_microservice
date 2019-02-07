const employees = require('./lib/employees'),
    ping = require('./lib/ping');

module.exports = (app, options) => {
    app.use('/api', ping());
    app.use('/api', employees(options));
};
