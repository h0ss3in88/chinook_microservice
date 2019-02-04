const movies = require('./lib/movies'),
      ping = require('./lib/ping')
module.exports = (app,options) => {
    app.use('/api',ping());
    app.use('/api',movies(options));
}
