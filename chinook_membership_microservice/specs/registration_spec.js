/* eslint-disable no-undef */
const assert = require('assert'),
    redis = require('redis'),
    { Registration } = require('../processes'),
    { connect } = require('../utils/repository');

let client, repo;

before(async() => {
    client = redis.createClient({ 'host': 'localhost', 'port': 6379 });
    await connect(client).then((rep) => {
        repo = rep;
    }).catch((err) => {
        throw err;
    });
    client.on('connect', () => {
        console.log('connected to redis');
    });
    client.on('error', (err) => {
        console.log(`disconnected from redis ${err}`);
    });
});
describe('Registration Integration test', () => {
    let reg, result, error;

    before(async() => {
        // reg = new Registration({ 'repo': repo, 'args': { 'email': 'test2@test.com', 'password': 'wIet$$&((dsf', 'confirm': 'wIet$$&((dsf' } });
        // reg = new Registration({ 'repo': repo, 'args': { 'email': 'test@test.com', 'password': 'wet$$&((dsf', 'confirm': 'wet$$&((dsf' } });
        reg = new Registration({ 'repo': repo, 'args': { 'email': 'mohammad.hussein.taherian@gmail.com', 'password': 'Hussein@123456', 'confirm': 'Hussein@123456' } });
        await reg.start().then((res) => {
            result = res[ 0 ];
        }).catch((err) => {
            error = err;
        });
    });
    it('Register user successfully', () => {
        console.log(result);
        console.log(error);
        console.log(result !== null);
        assert.ok(error === undefined);
        assert.ok(result !== null);
    });
});
