const assert = require('assert'),
    redis = require('redis'),
    supertest = require('supertest'),
    { start } = require('../server'),
    { connect } = require('../utils/repository'),
    { Authentication } = require('../processes');
let client, repo;

before(async() => {
    client = redis.createClient({ 'host': 'localhost', 'port': 6379 });
    await connect(client).then((rep) => {
        repo = rep;
    });
    client.on('connect', () => {
        console.log('connected to redis');
    });
    client.on('error', (err) => {
        console.log(`disconnected from redis ${err}`);
    });
});
describe('Authentication Integration Test', () => {
    let options = {}, app;

    before(async() => {
        options.micro_port = 4601;
        options.repo = repo;
        try {
            app = await start(options);
        } catch (error) {
            throw error;
        }
    });
    describe('authentication with expressJS api', () => {
        it('authenticate with valid inputs ', async() => {
            try {
                await supertest(app)
                    .post('/api/accounts/login')
                    .send({ 'email': 'test@test.com', 'password': 'wet$$&((dsf' })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        console.log(response.body);
                        assert.ok(response.body !== null);
                    });
            } catch (error) {
                console.log(error);
                assert.ok(error === null || error === undefined, error);
                throw error;
            }
        });
    });
    describe('authentication with valid inputs', () => {
        let auth,
            resultObj,
            errorResult;

        before(async() => {
            auth = new Authentication({ 'repo': repo, 'args': { 'email': 'test2@test.com', 'password': 'wIet$$&((dsf' } });
            try {
                resultObj = await auth.start();
            } catch (error) {
                errorResult = error;
            }
        });
        it('successful authentication ', () => {
            console.log(resultObj);
            assert.ok(errorResult === null || errorResult === undefined);
            assert.ok(resultObj !== null || resultObj !== undefined );
        });
    });
    describe('authentication with invalid inputs', () => {
        let auth,
            resultObj,
            errorResult;

        before(async() => {
            auth = new Authentication({ 'repo': repo, 'args': { 'email': 'tAet2@test.com', 'password': 'wIet$$&((dsf' } });
            try {
                resultObj = await auth.start();
            } catch (error) {
                errorResult = error;
            }
        });
        it('user not found by presented email', () => {
            assert.ok(resultObj == null || resultObj === undefined);
            assert.ok(errorResult.message === 'email does not exist');
        });
        before(async() => {
            auth = new Authentication({ 'repo': repo, 'args': { 'email': 'test2@test.com', 'password': 'wIet$$&((f' } });
            try {
                resultObj = await auth.start();
            } catch (error) {
                errorResult = error;
            }
        });
        it('user not authentication by incorrect password', () => {
            assert.ok(resultObj == null || resultObj === undefined);
            assert.ok(errorResult.message === 'password mismatched');
        });
    });
});
