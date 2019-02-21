const express = require('express'),
    status = require('http-status'),
    passport = require('passport'),
    router = express.Router();

module.exports = (options) => {
    if (!options.repo) {
        throw new Error('there is no repository');
    }
    router.post('/accounts/data', (req, res) => {
        const { email } = req.body;

        return res.status(status.OK).json(email);
    });
    router.get('/accounts/verify', [ passport.authenticate('jwt', { 'session': false }) ], (req, res) => {
        if (req.user) {
            return res.status(status.ACCEPTED).send(true);
        }
        return res.status(status.UNAUTHORIZED).send(false);
    });
    router.get('/accounts/profile', [ passport.authenticate('jwt', { 'session': false }) ], (req, res) => {
        return res.json({
            'user': req.user,
            'message': 'secure with passport and json web token',
            'token': req.query.auth_token
        });
    });
    router.post('/accounts/login', async(req, res, next) => {
        console.log(req.body);
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
