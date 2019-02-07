const http = require('http'),
    debug = require('debug')('emp'),
    cluster = require('cluster'),
    os = require('os'),
    { asValue } = require('awilix'),
    { EventEmitter } = require('events'),
    { start } = require('./server'),
    { init } = require('./config'),
    { connect } = require('./utilities/repository'),
    { connector } = require('./utilities/dbConnection');

process.on('uncaughtException', (err) => {
    debug(`Unhandled Exception ${err}`);
});

process.on('uncaughtRejection', (err, promise) => {
    debug(`Unhandled Rejection ${err} \r\n ${promise}`);
});
let mediator = new EventEmitter();

mediator.on('di.ready', (container) => {
    debug('Dependencies successfully registered .... ');
    connector(mediator);
    debug('emit db.connect for connecting to database');
    mediator.emit('db.connect', container);
});
mediator.on('db.ready', (container) => {
    debug('connected successfully to database.... ');
    connect(container)
        .then((repository) => {
            debug('repository created successfully .... ');
            container.register('repo', asValue({ repository }));
            mediator.emit('repository.ready', container);
        }).catch((err) => {
            debug(err);
            throw new Error(err.message);
        });
});

init(mediator);

if (cluster.isMaster) {
    debug('forking from master .... ');
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        debug(`worker forked on ${worker.process.pid} process id`);
    });
    cluster.on('exit', (worker) => {
        debug(`worker with ${worker.process.pid} process id dead`);
    });
} else if (cluster.isWorker) {
    mediator.emit('init.di', null);
    mediator.on('repository.ready', (container) => {
        start(container).then((expressApp) => {
            let server = http.createServer(expressApp);

            server.listen(expressApp.get('port'), () => {
                debug(`movies microservice is up and running | listening at ${server.address().address}:${server.address().port}`);
            });
        }).catch((err) => {
            debug(err);
            throw new Error(err.message);
        });
    });
}
