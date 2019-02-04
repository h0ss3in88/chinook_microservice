const http = require('http'),
      cluster = require('cluster'),
      os = require('os'),
      { EventEmitter } = require('events'),
      app = require('./server'),
      _ = require('lodash'),
      {connect} = require('./repository'),
      {connector} = require('./dbConnection'),
      config = require('./config');

let mediator = new EventEmitter();
mediator.on('db.ready',(db) => {
    console.log('connected successfully to database.... ');
    connect(db)
        .then((repository) => {
            console.log('repository created successfully .... ');
            let _opt = { repo: repository };
            _.merge(_opt, config);
            app.start(_opt).then((expressApp) => {
                if (cluster.isMaster) {
                    console.log('forking from master .... ');
                    for (let i = 0; i < os.cpus().length; i++) {
                        cluster.fork();
                    }
                    cluster.on('online', (worker) => {
                        console.log(`worker forked on ${worker.process.pid} process id`);
                    });
                    cluster.on('exit', (worker) => {
                        console.log(`worker with ${worker.process.pid} process id dead`);
                    });
                } else if (cluster.isWorker) {
                    let server = http.createServer(expressApp);
                    server.listen(expressApp.get('port'), () => {
                        console.log(`movies microservice is up and running | listening at ${server.address().address}:${server.address().port}`);
                    });
                }
            }).catch(err => {
                console.log(err);
                throw new Error(err.message);
            });
        }).catch((err) => {
            throw new Error(err.message);
        });
});
connector(mediator);
console.log('emit db.connect for connecting to database');
mediator.emit('db.connect', config);