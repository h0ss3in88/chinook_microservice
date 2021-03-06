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
        options.microPort = 4602;
        options.repo = repo;
        try {
            app = await start(options);
        } catch (error) {
            throw error;
        }
    });
    describe('verification', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6Im1vaGFtbWFkLmh1c3NlaW4udGFoZXJpYW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTQ5ODMyNTA2LCJleHAiOjE1NDk4NzU3MDZ9.57GXeBlV5tnVOt2ZiKqF4q6q1jUrjgW2e2cXnCj9CRg';

        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6Im1vaGFtbWFkLmh1c3NlaW4udGFoZXJpYW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTQ5ODMyNTA2LCJleHAiOjE1NDk4NzU3MDZ9.57GXeBlV5tnVOt2ZiKqF4q6q1jUrjgW2e2cXnCj9CRg
        it('authenticate with valid token ', async() => {
            try {
                await supertest(app)
                    .get('/api/accounts/profile')
                    .set('Authorization', `Bearer ${token}`)
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
    describe('authentication with expressJS api', () => {
        it('authenticate with valid inputs ', async() => {
            try {
                await supertest(app)
                    .post('/api/accounts/login')
                    .send({ 'email': 'mohammad.hussein.taherian@gmail.com', 'password': 'Hussein@123456' })
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
