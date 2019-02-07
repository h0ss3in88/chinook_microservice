const { createContainer, asValue, asFunction } = require('awilix'),
    debug = require('debug')('emp');

function init({ serverConfig, dbSettings }, mediator) {
    mediator.on('init.di', () => {
        debug('DI initialization .... ');
        const container = createContainer({
            'injectionMode': 'PROXY'
        });

        container.register({
            'asValue': asFunction(asValue),
            'asFunction': asFunction(asFunction),
            'microPort': asValue(serverConfig.microPort),
            'pg_host': asValue(dbSettings.pgHost),
            'pg_port': asValue(dbSettings.pgPort),
            'pg_user': asValue(dbSettings.pgUser),
            'pg_password': asValue(dbSettings.pgPassword),
            'pg_db': asValue(dbSettings.pgDb)
        });
        mediator.emit('di.ready', container);
    });
}

module.exports.initDI = init;
