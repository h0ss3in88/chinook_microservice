/* eslint-disable no-undef,no-console,no-shadow,one-var */
const redis = require('redis'),
    assert = require('assert'),
    bcrypt = require('bcryptjs'),
    { User } = require('../models/user');
let _user;


const generateSalt = () => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, 'b', (err, salt) => {
                if (err) {
                    return reject(err);
                }
                return resolve(salt);
            });
        });
    },
    generateHash = (plaintText, salt) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(plaintText, salt, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    },
    password = (pass) => {
        const plainPassword = 's48g(7)^%*';

        generateSalt().then((salt) => {
            return generateHash(plainPassword, salt);
        }).then((result) => {
            pass = result;
        }).catch((err) => {
            console.log(err);
        });
    };

before(async() => {
    _user = new User({ 'id': 1, 'email': 'testEmail@gmail.com', 'password': 'mht123456' });
    await _user.createPassword();
});
describe('redis client behavior', () => {
    let client, connected;

    before((done) => {
        client = redis.createClient({ 'host': 'localhost', 'port': 6379 });
        client.on('connect', () => {
            connected = true;
            console.log(`connected to redis ${client.address}`);
            done();
        });
        client.on('error', (err) => {
            console.log(err);
            done();
        });
    });
    it('redis connected to localhost redis successfully', () => {
        console.log(connected);
        assert.ok(connected === true);
    });
    it('there is no keys in redis dataStore', async() => {
        await client.keys('*', (err, replies) => {
            console.log(replies);
            assert.ok(err == null);
            assert.ok(replies.length === 0);
        });
    });
    it('create new database called ONEs --> 1', async() => {
        await client.select(1, (err, res) => {
            assert.ok(err === null);
            console.log(err);
            console.log(res);
            client.set('foo', 'bar');
        });
    });
    it('select foo=bar from number 1 database', async() => {
        await client.select(1, (err, res) => {
            assert.ok(res === 'OK');
            assert.ok(err == null);
            client.get('foo', (err, result) => {
                assert.ok(err === null);
                assert.ok(result === 'bar');
            });
        });
    });
    it('set users:id in number 1 database', async() => {
        await client.select(1, (err, res) => {
            console.log(err);
            console.log(res);
            assert.ok(res === 'OK');
            assert.ok(err == null);

            console.log(_user);
            console.log(_user.password);

            client.get('foo', (err, result) => {
                assert.ok(err === null);
                assert.ok(result === 'bar');
            });
            client.set('users:1', JSON.stringify(_user), (err, res) => {
                assert.ok(err == null);
                console.log(res);
            });
        });
    });

    it('bcrypt ', async() => {
        let pass;

        await generateSalt().then((result) => {
            return generateHash('sr46#$^', result);
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    });

    it('create user', async() => {
        let check;


        let _user = new User({ 'email': 'hussein@gmail.com', 'password': 'sderhtbg@$%&%' });

        await _user.generatePassword();
        console.log(_user.password);

        await _user.comparePassword('sderhtbg@$%&%').then((result) => {
            check = result;
        });

        console.log(check);
    });

    it('remove user', async() => {
        try {
            await client.select('2');
            let result = await client.del('users');

            console.log(result);
            assert.ok(await result === true);
            await client.send_command('hdel', [ 'users:1', 'id', 'email', 'hashedPassword', 'createdAt', 'modifiedAt', 'viewCount', 'lastLoginAt', 'isActive' ], (err, response) => {
                console.log(err);
                console.log(response);
                assert.ok(err === null || err === undefined, err);
                assert.ok(response === 8, response);
            });
        } catch (error) {
            throw error;
        }
    });
});
