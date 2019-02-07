const bcrypt = require('bcrypt'),
    validator = require('validator'),
    _ = require('lodash');

class User {
    constructor(args) {
        this._id = args.id || 0;
        this._email = args.email;
        this._hashedPassword = args.password || args.hashedPassword;
        this._lastLoginAt = args.lastLoginAt || Date.now();
        this._viewCount = args.viewCount || 0;
        this._createdAt = args.createdAt || Date.now();
        this._modifiedAt = args.modifiedAt || Date.now();
        this._isActive = args.isActive || true;
    }

    set id(value) {
        /* we can use isNaN() || typeof == number */
        if (validator.isNumeric(value.toString())) {
            this._id = value;
        }
    }
    get id() {
        return this._id;
    }

    get email() {
        return this._email;
    }
    set email(value) {
        if (validator.isEmail(value)) {
            this._email = value;
        }
    }
    set password(value) {
        this._hashedPassword = value;
    }
    get password() {
        if (this._hashedPassword) {
            return this._hashedPassword;
        }
        return null;
    }
    set viewCount(value) {
        if (validator.isNumeric(value.toString())) {
            this._viewCount = value;
        }
    }
    get viewCount() {
        return this._viewCount;
    }
    set lastLoginAt(value) {
        this._lastLoginAt = value;
    }
    get lastLoginAt() {
        return this._lastLoginAt;
    }
    set createdAt(value) {
        this._createdAt = value;
    }
    get createdAt() {
        return this._createdAt;
    }
    set modifiedAt(value) {
        this._modifiedAt = value;
    }
    get modifiedAt() {
        return this._modifiedAt;
    }
    set isActive(value) {
        if (validator.isBoolean(value)) {
            this._isActive = value;
        }
    }
    get isActive() {
        return this._isActive;
    }
    generateSalt() {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, 'b', (err, salt) => {
                if (err) {
                    return reject(err);
                }
                return resolve(salt);
            });
        });
    }
    generateHash(plaintText, salt) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(plaintText, salt, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }
    generatePassword() {
        return Promise.all([ this.generateSalt().then((salt) => {
            return this.generateHash(this._hashedPassword, salt);
        }).then((hashed) => {
            this.password = hashed;
        }).catch((err) => {
            throw err;
        }) ]);
    }
    createPassword() {
        bcrypt.genSalt(this._saltRounds, (sltErr, salt) => {
            bcrypt.hash(this._plainPassword, salt, (hashErr, hash) => {
                this.password = hash;
            });
        });
    }
    comparePassword(password) {
        return new Promise((resolve, reject) => {
            if (!validator.isEmpty(password) && !_.isUndefined(password) && !_.isNull(password)) {
                bcrypt.compare(password, this._hashedPassword, (err, res) => {
                    // res == true
                    if (err) {
                        return reject(new Error(err));
                    } else if (res === false) {
                        return reject(new Error('password mismatched'));
                    }
                    return resolve(res);
                });
            } else {
                return reject(new Error('invalid input'));
            }
        });
    }
    save() {
        let saveObj = Object.create({});

        saveObj.id = this.id;
        saveObj.email = this.email;
        saveObj.hashedPassword = this.password;
        saveObj.viewCount = this.viewCount;
        saveObj.lastLoginAt = this.lastLoginAt;
        saveObj.isActive = this.isActive;
        saveObj.createdAt = this.createdAt;
        saveObj.modifiedAt = this.modifiedAt;
        return saveObj;
    }
}

module.exports = Object.assign({}, { User });
