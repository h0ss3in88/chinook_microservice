const repository = (db) => {
        const customers = db.customer,
            getAllCustomers = () => {
                return new Promise((resolve, reject) => {
                    customers.find({}).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getCustomerById = (id) => {
                return new Promise((resolve, reject) => {
                    customers.findOne({ 'customer_id': id }).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getCustomerByFirstName = (firstName) => {
                return new Promise((resolve, reject) => {
                    customers.findOne({ 'first_name': firstName }).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getCustomerByNames = (firstName, lastName) => {
                return new Promise((resolve, reject) => {
                    customers.findOne({ 'first_name': firstName, 'last_name': lastName }).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            };

        return Object.create({
            getAllCustomers,
            getCustomerById,
            getCustomerByFirstName,
            getCustomerByNames
        });
    },
    connect = (connection) => {
        if (!connection) {
            return Promise.reject(new Error('connection db not supplied!'));
        }
        return Promise.resolve(repository(connection));
    };

module.exports = Object.assign({}, { connect });
