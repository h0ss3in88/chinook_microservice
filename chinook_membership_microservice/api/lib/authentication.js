const express = require('express'),
    status = require('http-status'),
    passport = require('passport'),
    router = express.Router();

module.exports = (options) => {
    if (!options.repo) {
        throw new Error('there is no repository');
    }

    router.get('/accounts/profile', passport.authenticate('jwt'), (req, res) => {
        return res.json({
            'user': req.user,
            'message': 'secure with passport and json web token',
            'token': req.query.auth_token
        });
    });
    router.post('/accounts/login', async(req, res, next) => {
        passport.authenticate('signIn', async(err, result, info) => {
            if (err) {
                return next(err);
            }
            req.login(result.user, { 'session': false }, (error) => {
                if (error) {
                    return next(error);
                }
            });
            return res.status(status.OK).json(result.token);
        })(req, res, next);
    });
    router.post('/accounts/register', passport.authenticate('signUp', { 'session': false }), async(req, res, next) => {
        return res.send({
            'message': 'registration was successful',
            'user': req.user
        });
    });

    return router;
};
