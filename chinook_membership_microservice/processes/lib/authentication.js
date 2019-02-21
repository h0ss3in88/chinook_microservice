/* eslint-disable one-var */
const validator = require('validator'),
    jwt = require('jsonwebtoken'),
    { User } = require('../../models/user'),
    _validate = (args) => {
        return new Promise((resolve, reject) => {
            if (!!args.email && !!args.password && validator.isEmail(args.email) && validator.isLength(args.password, { 'min': 6, 'max': 20 })) {
                return resolve(true);
            }
            return reject(new Error('invalid email or password'));
        });
    },
    _checkEmail = async(args) => {
        let userId;

        try {
            userId = await args._repo.getUserByEmail(args.email);
            return userId;
        } catch (error) {
            throw error;
        }
    },
    _authenticate = async(args) => {
        let result, userId;

        try {
            userId = await _checkEmail({ '_repo': args._repo, 'email': args._user.email });
            let user = new User(JSON.parse(await args._repo.getUserById(userId)));

            if (user) {
                await user.comparePassword(args._user.password);
                let _viewCount = parseInt(user.viewCount);

                user.viewCount = _viewCount + 1;
                user.lastLoginAt = Date.now();
                user.modifiedAt = Date.now();
                await args._repo.replaceUser(user.id, user.save());
                const body = {
                    'id': user.id,
                    'email': user.email,
                    'role': 'admin'
                };
                const token = jwt.sign(body, 'xAuthSybilTokenSecret', { 'expiresIn': '12h' });

                result = {
                    'token': token,
                    'success': 1,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'lastLoginAt': user.lastLoginAt,
                        'viewCount': user.viewCount
                    }
                };

                return result;
            }
        } catch (error) {
            throw error;
        }
    };

class Authentication {
    constructor(options) {
        this._repo = options.repo;
        this._user = options.args;
    }

    async verifyToken(options) {
        console.log(1);
        let verificationResult = {};

        if (options.token === undefined || options.token === null || options.token.length === 0) {
            throw new Error('token required');
        }
        try {
            let user = await this._repo.getUserById(options.token.id);

            if (user) {
                verificationResult.user = user;
                verificationResult.signal = true;
                return verificationResult;
            }
            verificationResult.user = null;
            verificationResult.signal = false;
        } catch (error) {
            throw error;
        }
    }
    async start() {
        let result;

        try {
            await _validate(this._user);
            result = await _authenticate({ '_repo': this._repo, '_user': this._user });
            return result;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = Authentication;
