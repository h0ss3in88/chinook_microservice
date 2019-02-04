/* eslint-env mocha */
const assert = require('assert'),
    request = require('supertest'),
    massive = require('massive'),
    _ = require('lodash'),
    { connect } = require('../repository'),
    { start } = require('../server'),
    config = require('../config');

process.env.NODE = 'test';
let db, expressApp, repo, options = {};

before(async() => {
    try {
        db = await massive({ 'host': config.pg_host, 'port': config.pg_port, 'user': config.pg_user, 'password': config.pg_password, 'database': config.pg_db });
        repo = await connect(db);
    } catch (error) {
        throw error;
    }
});
describe('CUSTOMERS REST API INTEGRATION TEST', () => {
    before(async() => {
        options.microPort = config.microPort;
        options.repo = repo;
        try {
            expressApp = await start(options);
        } catch (error) {
            throw error;
        }
    });
    it('GET REQUEST FOR api/customers returns all customers', () => {
        request(expressApp)
            .get('/api/customers')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then((response) => {
                assert.ok(response.body !== null);
                assert.ok(response.body.length === 59);
                assert.ok(_.isArray(response.body));
            }).catch((error) => {
                assert.ok(error === undefined || error === null);
            });
    });
    it('GET REQUEST FOR api/customers/1 returns One customer with #1 as identifier', () => {
        request(expressApp)
            .get('/api/customers/1')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then((response) => {
                assert.ok(response.body !== null || response.body !== undefined);
                assert.ok(response.body.customerId === 1);
                assert.ok(response.body.firstName === 'Luís');
            }).catch((error) => {
                assert.ok(error === null || error === undefined);
            });
    });
    it('POST REQUEST FOR api/customers/search', async() => {
        let errors;

        await request(expressApp)
            .post('/api/customers/search')
            .send({ 'firstName': 'Luís', 'lastName': 'Gonçalves' })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then((response) => {
                assert.ok(response.body);
                assert.ok(response.body.lastName === 'Gonçalves');
                assert.ok(response.body.firstName === 'Luís');
            }).catch((error) => {
                errors = error;
            });
        assert.ok(errors === null || errors === undefined);
    });
});
