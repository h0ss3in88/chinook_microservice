const repository = (container) => {
        const db = container.resolve('db'),
            employees = db.employee,
            getAllEmployees = () => {
                return new Promise((resolve, reject) => {
                    employees.find({}).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getEmployeeById = (id) => {
                return new Promise((resolve, reject) => {
                    employees.findOne({ 'employee_id': id }).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getEmployeeByNames = (firstName, lastName) => {
                return new Promise((resolve, reject) => {
                    employees.findOne({ 'first_name': firstName, 'last_name': lastName }).then((employee) => {
                        return resolve(employee);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getEmployeeByCountry = (country) => {
                return employees.find({ 'country': country }).then((result) => {
                    return Promise.resolve(result);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            },
            createEmployee = (newEmployee) => {
                return new Promise((resolve, reject) => {
                    employees.insert(newEmployee).then((employee) => {
                        return resolve(employee);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            updateEmployee = (id, payload) => {
                return new Promise((resolve, reject) => {
                    employees.update(id, payload).then((updatedEmployees) => {
                        return resolve(updatedEmployees);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            deleteEmployee = (id) => {
                return new Promise((resolve, reject) => {
                    employees.destroy(id).then((deletedEmployee) => {
                        return resolve(deletedEmployee);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            };

        return Object.create({
            getAllEmployees,
            getEmployeeById,
            getEmployeeByNames,
            getEmployeeByCountry,
            createEmployee,
            updateEmployee,
            deleteEmployee
        });
    },
    connect = (container) => {
        if (!container.resolve('db')) {
            return Promise.reject(new Error('connection db not supplied!'));
        }
        return Promise.resolve(repository(container));
    };

module.exports = Object.assign({}, { connect });
