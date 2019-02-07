const http = require('http'),
    cluster = require('cluster'),
    os = require('os'),
    debug = require('debug')('mem'),
    { EventEmitter } = require('events'),
    app = require('./server'),
    _ = require('lodash'),
    { connect } = require('./utils/repository'),
    { connector } = require('./utils/dbConnection'),
    config = require('./configs/config');

let mediator = new EventEmitter();

mediator.on('db.ready', (db) => {
    debug('connected successfully to database.... ');
    connect(db)
        .then((repository) => {
            debug('repository created successfully .... ');
            let _opt = { 'repo': repository };

            _.merge(_opt, config);
            app.start(_opt).then((expressApp) => {
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
                    let server = http.createServer(expressApp);

                    server.listen(expressApp.get('port'), () => {
                        debug(`movies microservice is up and running | listening at ${server.address().address}:${server.address().port}`);
                    });
                }
            }).catch((err) => {
                debug(err);
                throw new Error(err.message);
            });
        }).catch((err) => {
            throw new Error(err.message);
        });
});
connector(mediator);
debug('emit db.connect for connecting to database');
mediator.emit('db.connect', config);
