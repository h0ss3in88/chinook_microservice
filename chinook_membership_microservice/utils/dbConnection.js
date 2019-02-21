const redis = require('redis');
let mediator;
const connector = (md) => {
        mediator = md;
        mediator.on('db.connect', redisConnector);
    },
    redisConnector = (options) => {
        process.nextTick(() => {
            console.log('connecting to database .... ');
            let client = redis.createClient({ 'host': options.redis_host, 'port': options.redis_port });

            client.on('connect', () => {
                mediator.emit('db.ready', client);
            });
            client.on('error', (err) => {
                mediator.emit('db.err', err);
            });
            client.on('ECONNREFUSED', (err) => {
                console.log('xxx');
                mediator.emit('db.err', err);
            });
        });
    };

module.exports = Object.assign({}, { connector });
