const { start } = require('../server'),
    assert = require('assert'),
    supertest = require('supertest'),
    _ = require('lodash');
let options = {},
    app,
    movies = [
        {
            'film_id': 1,
            'title': 'Academy Dinosaur',
            'description': 'A Epic Drama of a Feminist And a Mad Scientist who must Battle a Teacher in The Canadian Rockies',
            'release_year': 2006,
            'language_id': 1,
            'rental_duration': 6,
            'rental_rate': '0.99',
            'length': 86,
            'replacement_cost': '20.99',
            'rating': 'PG',
            'last_update': '2013-05-26T10:20:58.951Z',
            'special_features': [
                'Deleted Scenes',
                'Behind the Scenes'
            ]
        },
        {
            'film_id': 2,
            'title': 'Ace Goldfinger',
            'description': 'A Astounding Epistle of a Database Administrator And a Explorer who must Find a Car in Ancient China',
            'release_year': 2006,
            'language_id': 1,
            'rental_duration': 3,
            'rental_rate': '4.99',
            'length': 48,
            'replacement_cost': '12.99',
            'rating': 'G',
            'last_update': '2013-05-26T10:20:58.951Z',
            'special_features': [
                'Trailers',
                'Deleted Scenes'
            ]
        }, {
            'film_id': 3,
            'title': 'Adaptation Holes',
            'description': 'A Astounding Reflection of a Lumberjack And a Car who must Sink a Lumberjack in A Baloon Factory',
            'release_year': 2006,
            'language_id': 1,
            'rental_duration': 7,
            'rental_rate': '2.99',
            'length': 50,
            'replacement_cost': '18.99',
            'rating': 'NC-17',
            'last_update': '2013-05-26T10:20:58.951Z',
            'special_features': [
                'Trailers',
                'Deleted Scenes'
            ]
        },
        {
            'film_id': 4,
            'title': 'Affair Prejudice',
            'description': 'A Fanciful Documentary of a Frisbee And a Lumberjack who must Chase a Monkey in A Shark Tank',
            'release_year': 2006,
            'language_id': 1,
            'rental_duration': 5,
            'rental_rate': '2.99',
            'length': 117,
            'replacement_cost': '26.99',
            'rating': 'G',
            'last_update': '2013-05-26T10:20:58.951Z',
            'special_features': [
                'Commentaries',
                'Behind the Scenes'
            ]
        },
        {
            'film_id': 5,
            'title': 'African Egg',
            'description': 'A Fast-Paced Documentary of a Pastry Chef And a Dentist who must Pursue a Forensic Psychologist in The Gulf of Mexico',
            'release_year': 2006,
            'language_id': 1,
            'rental_duration': 6,
            'rental_rate': '2.99',
            'length': 130,
            'replacement_cost': '22.99',
            'rating': 'G',
            'last_update': '2013-05-26T10:20:58.951Z',
            'special_features': [
                'Deleted Scenes'
            ]
        }
    ];

describe.only('movies microservice', () => {
    before((done) => {
        options.micro_port = 4601;
        options.repo = {
            'getAllCustomers': () => {
                return Promise.resolve(movies);
            },
            'getCustomerById': (id) => {
                return Promise.resolve(_.find(movies, (obj) => {
                    return obj.film_id == id;
                }));
            }
        };
        start(options).then((application) => {
            app = application;
            done();
        }).catch((err) => {
            done(err);
        });
    });
    describe('/api/movies/:id', () => {
        it('5 movies returns for sending GET /api/movies', (done) => {
            supertest(app)
                .get('/api/movies')
                .expect('Content-Type', /json/)
                // .expect('Accept', 'application/json')
                .expect(200)
                .end((err, res) => {
                    assert.ok(err == null);
                    assert.ok(res.body != null);
                    assert.ok(res.body.length == 5);
                    done();
                });
        });
        it('return movie #3 as request GET /api/movies/3', (done) => {
            supertest(app)
                .get('/api/movies/3')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    assert.ok(err == null);
                    assert.ok(res.body != null);
                    assert.ok(res.body.film_id == 3);
                    done();
                });
        });
    });
});
