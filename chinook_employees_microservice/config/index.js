/* eslint-disable camelcase */
const serverConfig = require('./lib/appConfig'),
    dbSettings = require('./lib/dbConfig'),
    { initDI } = require('./lib/diConfig');
let init = initDI.bind(null, { serverConfig, dbSettings });

module.exports = Object.assign({}, { init });
