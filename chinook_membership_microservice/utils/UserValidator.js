/* eslint-disable one-var */
const validator = require('validator'),
    _ = require('lodash');

const validateUser = (args) => {
    return !_.isUndefined(args) && validateEmail(args.email) && validatePassword(args.password) && validateConfirmPassword(args.confirm, args.password);
};

const validateEmail = (email) => {
    return !validator.isEmpty(email) && !!validator.isEmail(email);
};

const validatePassword = (password) => {
    return !validator.isEmpty(password) && !!validator.isLength(password, { 'min': 6, 'max': 20 });
};

const validateConfirmPassword = (confirm, password) => {
    return !validator.isEmpty(confirm) && !!validator.isLength(confirm, { 'min': 6, 'max': 20 }) && !!validator.equals(confirm, password);
};

module.exports = Object.assign({}, { validateUser });
