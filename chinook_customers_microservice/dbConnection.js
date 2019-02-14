/* eslint-disable one-var */
const massive = require('massive'),
    debug = require('debug')('cs');
let mediator;
const connector = (md) => {
    mediator = md;
    mediator.on('db.connect', massiveConnector);
};
const massiveConnector = (options) => {
    process.nextTick(() => {
        debug('connecting to database .... ');
        massive({
            'host': options.pg_host,
            'port': options.pg_port,
            'user': options.pg_user,
            'password': options.pg_password,
            'database': options.pg_db
        }).then((db) => {
            mediator.emit('db.ready', db);
        }).catch((err) => {
            mediator.emit('db.err', err);
        });
    });
};

module.exports = Object.assign({}, { connector });
