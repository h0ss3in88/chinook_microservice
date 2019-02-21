/* eslint-disable one-var,no-shadow */
/* https://github.com/mozilla/node-convict  https://traefik.io/ */
const repository = (db) => {
        const createNewUser = (newUser) => {
            return new Promise((resolve, reject) => {
                db.select(2, (err, res) => {
                    if (err) {
                        return reject(new Error(err));
                    } else if (res === 'OK') {
                        db.incr('users', (err, id) => {
                            if (err) {
                                return reject(err);
                            }
                            db.hmset(`users:${id}`, newUser, (error, result) => {
                                if (err) {
                                    return reject(error);
                                }
                                db.set(`users:email:${newUser.email}`, newUser.id, (err, result) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                });
                                return resolve(result);
                            });
                        });
                    }
                });
            });
        };
        const removeUser = (userId) => {
            return new Promise((resolve, reject) => {
                /*  first: find email address by userId then remove user's email from index */
                /*  second:  incr users number by -1 */
                /*  third:  remove entire user from set */

                db.select(2, (err, reply) => {
                    if (err) {
                        return reject(err);
                    } else if (reply === 'OK') {
                        db.hget(`users:${userId}`, 'email', (err, email) => {
                            if (err) {
                                return reject(err);
                            } else if (email !== null) {
                                db.del(`users:${email}`, (err, deleteReply) => {
                                    if (err) {
                                        return reject(err);
                                    } else if (deleteReply === 'OK') {
                                        db.incrby('users', -1, (err, usersCount) => {
                                            if (err) {
                                                return reject(err);
                                            } else if (usersCount !== null) {
                                                db.send_command(`hdel users:${userId}`, [ '_id', '_email', '_hashedPassword', '_viewCount', '_lastLoginAt', '_createdAt', '_modifiedAt' ], (err, deleteResult) => {
                                                    if (err) {
                                                        return reject(err);
                                                    }
                                                    return resolve(deleteResult);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        };
        const getUsersCount = () => {
            return new Promise((resolve, reject) => {
                db.select('2', (err, response) => {
                    if (err) {
                        return reject(err);
                    } else if (response === 'OK') {
                        db.get('users', (error, result) => {
                            if (error) {
                                return reject(error);
                            } else if (result === null) {
                                db.set('users', 0, (err, result) => {
                                    if (err) {
                                        return reject(err);
                                    } else if (result === 'OK') {
                                        return resolve(0);
                                    }
                                });
                            }
                            return resolve(result);
                        });
                    }
                });
            });
        };
        const getAllUsers = () => {
            return new Promise((resolve, reject) => {
                db.hgetall('users:*', (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
        };
        const getUserById = (id) => {
            return new Promise((resolve, reject) => {
                db.select('2', (err, reply) => {
                    if (err) {
                        return reject(err);
                    } else if (reply === 'OK') {
                        db.hgetall(`users:${id}`, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(JSON.stringify(result));
                        });
                    }
                });
            });
        };
        const getUserByEmail = (email) => {
            return new Promise((resolve, reject) => {
                db.select('2', (err, reply) => {
                    if (err) {
                        return reject(err);
                    } else if (reply === 'OK') {
                        db.get(`users:email:${email}`, (err, result) => {
                            if (err) {
                                return reject(err);
                            } else if (result === null) {
                                return reject(new Error('email does not exist'));
                            } else if (result) {
                                return resolve(result);
                            }
                        });
                    }
                });
            });
        };
        const checkDuplicateEmail = (email) => {
            return new Promise((resolve, reject) => {
                db.select('2', (err, reply) => {
                    if (err) {
                        return reject(err);
                    } else if (reply === 'OK') {
                        db.get(`users:email:${email}`, (err, result) => {
                            if (err) {
                                return reject(err);
                            } else if (result === null) {
                                return resolve(false);
                            } else if (result !== null && result !== undefined) {
                                return resolve(true);
                            }
                        });
                    }
                });
            });
        };
        const getUserByFirstName = (firstName) => {
            return new Promise((resolve, reject) => {
                db.find({ 'first_name': firstName }).then((results) => {
                    return resolve(results);
                }).catch((err) => {
                    return reject(err);
                });
            });
        };
        const getUserByLastName = (lastName) => {
            return new Promise((resolve, reject) => {
                db.find({ 'last_name': lastName }).then((results) => {
                    return resolve(results);
                }).catch((err) => {
                    return reject(err);
                });
            });
        };
        const replaceUser = (id, obj) => {
            return new Promise((resolve, reject) => {
                db.select(2, (err, res) => {
                    if (err) {
                        return reject(new Error(err));
                    } else if (res === 'OK') {
                        db.hmset(`users:${id}`, obj, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        });
                    }
                });
            });
        };

        return Object.create({
            createNewUser,
            replaceUser,
            removeUser,
            getAllUsers,
            getUserById,
            checkDuplicateEmail,
            getUserByEmail,
            getUserByFirstName,
            getUserByLastName,
            getUsersCount
        });
    },
    connect = (connection) => {
        if (!connection) {
            return Promise.reject(new Error('connection db not supplied!'));
        }
        return Promise.resolve(repository(connection));
    };

module.exports = Object.assign({}, { connect });
