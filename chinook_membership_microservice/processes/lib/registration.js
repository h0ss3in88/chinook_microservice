const { User } = require('../../models/user'),
    { validateUser } = require('../../utils/UserValidator'),
    _validate = (args) => {
        return new Promise((resolve, reject) => {
            if (validateUser(args)) {
                return resolve(true);
            }
            return reject(new Error('invalid email or password'));
        });
    },
    _checkEmail = async(args) => {
        let duplicate;

        try {
            duplicate = await args._repo.checkDuplicateEmail(args.email);
            return duplicate;
        } catch (error) {
            throw error;
        }
    },
    _save = async(args) => {
        let result,
            isDuplicate,
            userId,
            user = new User(args._user);

        await user.generatePassword();
        userId = await args._repo.getUsersCount();
        console.log(userId);
        isDuplicate = await _checkEmail({ '_repo': args._repo, 'email': user.email });
        console.log(isDuplicate);
        if (isDuplicate) {
            return Promise.reject(new Error('email has already exist'));
        }
        userId = parseInt(userId);
        userId++;

        user.id = userId;
        result = await args._repo.createNewUser(user.save());

        return result;
    };

class Registration {
    constructor(options) {
        this._repo = options.repo;
        this._user = options.args;
    }

    async start() {
        let result,
            isValid = await _validate(this._user);

        if (isValid) {
            console.log(true);
            result = await _save({ '_repo': this._repo, '_user': this._user });

            return result;
        }
        return Promise.reject(new Error('invalid inputs'));
        
        // let result = await Promise.all([ _validate(this._user).then((result) => {
        //     return this._save();
        // }).then((res) => {
        //     return Promise.resolve(res);
        // }).catch((err) => {
        //     return Promise.reject(err);
        // }) ]);
        //
        // return result;
    }
}

module.exports = Registration;
