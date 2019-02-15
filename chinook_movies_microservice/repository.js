
const repository = (db) => {
        const movies = db.film,

            getAllMovies = () => {
                return new Promise((resolve, reject) => {
                    movies.find({}).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getMovieById = (id) => {
                return new Promise((resolve, reject) => {
                    movies.findOne({ 'film_id': id }).then((result) => {
                        return resolve(result);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            getMovieByName = (name) => {
                return new Promise((resolve, reject) => {
                    movies.find({ 'name': name }).then((results) => {
                        return resolve(results);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            createMovie = (newMovie) => {
                return new Promise((resolve, reject) => {
                    movies.insert(newMovie).then((movie) => {
                        return resolve(movie);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            updateMovie = (id, payload) => {
                return new Promise((resolve, reject) => {
                    movies.update(id, payload).then((updatedMovies) => {
                        return resolve(updatedMovies);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            },
            deleteMovie = (id) => {
                return new Promise((resolve, reject) => {
                    movies.destroy(id).then((deletedMovie) => {
                        return resolve(deletedMovie);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            };

        return Object.create({
            getAllMovies,
            getMovieById,
            getMovieByName,
            createMovie,
            updateMovie,
            deleteMovie
        });
    },
    connect = (connection) => {
        if (!connection) {
            return Promise.reject(new Error('connection db not supplied!'));
        }
        return Promise.resolve(repository(connection));
    };

module.exports = Object.assign({}, { connect });
