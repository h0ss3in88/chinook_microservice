/* eslint-disable one-var */
const massive = require('massive'),
    { asValue } = require('awilix'),
    debug = require('debug')('emp');
let mediator;
const connector = (md) => {
    mediator = md;
    mediator.on('db.connect', massiveConnector);
};
const massiveConnector = (container) => {
    process.nextTick(() => {
        debug('connecting to database .... ');
        massive({
            'host': container.resolve('pg_host'),
            'port': container.resolve('pg_port'),
            'user': container.resolve('pg_user'),
            'password': container.resolve('pg_password'),
            'database': container.resolve('pg_db')
        }).then((db) => {
            container.register('db', asValue(db));
            mediator.emit('db.ready', container);
        }).catch((err) => {
            mediator.emit('db.err', err);
        });
    });
};

module.exports = Object.assign({}, { connector });
