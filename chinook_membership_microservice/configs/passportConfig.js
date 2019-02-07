const passport = require('passport'),
    { Strategy } = require('passport-local'),
    { ExtractJwt } = require('passport-jwt'),
    debug = require('debug')('mem'),
    JwtStrategy = require('passport-jwt').Strategy,
    { Registration, Authentication } = require('../processes');

module.exports = (repo) => {
    passport.use('signUp', new Strategy({
        'usernameField': 'email',
        'passwordField': 'password'
    }, async(email, password, confirmation, done) => {
        try {
            let reg = new Registration({ 'repo': repo, 'args': { 'email': email, 'password': password, 'confirm': confirmation } }),
                result = await reg.start();

            return done(null, result);
        } catch (error) {
            done(error);
        }
    }));

    passport.use('signIn', new Strategy({
        'usernameField': 'email',
        'passwordField': 'password'
    }, async(email, password, done) => {
        debug(email);
        try {
            let auth = new Authentication({ 'repo': repo, 'args': { 'email': email, 'password': password } }),
                result = await auth.start();

            return done(null, result);
        } catch (error) {
            done(error);
        }
    }));

    passport.use(new JwtStrategy({
        'secretOrKey': 'xAuthSybilTokenSecret',
        'jwtFromRequest': ExtractJwt.fromUrlQueryParameter('auth_token')
    }, async(token, done) => {
        try {
            done(null, token);
        } catch (error) {
            done(error);
        }
    }));
};

