const redis = require('redis');
let mediator;
const connector = (md) => {
        mediator = md;
        mediator.on('db.connect', redisConnector);
    },
    redisConnector = (options) => {
        process.nextTick(() => {
            console.log('connecting to database .... ');
            let client = redis.createClient({ 'host': options.REDIS_HOST, 'port': options.REDIS_PORT });

            client.on('connect', () => {
                mediator.emit('db.ready', client);
            });
            client.on('error', (err) => {
                mediator.emit('db.err', err);
            });
        });
    };

module.exports = Object.assign({}, { connector });
