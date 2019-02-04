
const repository = (db) => {
    const movies = db.film;

    const getAllMovies = () => {
        return new Promise((resolve,reject) => {
            movies.find({}).then((result) => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        });
    };
    const getMovieById = (id) => {
        return new Promise((resolve,reject) => {
            movies.findOne({ film_id : id }).then((result) => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        });
    };
    const getMovieActors = (id) => {
        return new Promise((resolve,reject) => {
            movies.find()
        })
    };
    return Object.create({
        getAllMovies: getAllCustomers,
        getMovieById: getCustomerById,
        getMovieActors
    });
};
const connect = (connection) => {
    if(!connection){
        return Promise.reject(new Error('connection db not supplied!'));
    }else{
        return Promise.resolve(repository(connection));
    }
};

module.exports = Object.assign({},{connect});