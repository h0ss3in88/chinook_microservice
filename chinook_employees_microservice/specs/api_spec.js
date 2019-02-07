const { start } = require('../server'),
    assert = require('assert'),
    supertest = require('supertest'),
    _ = require('lodash');
let options = {},
    app,
    employees = [
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

describe.only('employees microservice', () => {
    before((done) => {
        options.micro_port = 4602;
        options.repo = {
            'getAllEmployees': () => {
                return Promise.resolve(employees);
            },
            'getEmployeeById': (id) => {
                console.log(3);
                let result = _.find(employees, (obj) => {
                    return obj.film_id == id;
                });
                console.log(result);
                return Promise.resolve(result);
            }
        };
        start(options).then((application) => {
            app = application;
            done();
        }).catch((err) => {
            done(err);
        });
    });
    describe('/api/employees/:id', () => {
        it('5 employees returns for sending GET /api/employees', async() => {
            await supertest(app)
                .get('/api/employees')
                .expect('Content-Type', /json/)
                // .expect('Accept', 'application/json')
                .expect(200)
                .then((res) => {
                    assert.ok(res.body != null);
                    assert.ok(res.body.length === 5);
                }).catch((err) => {
                    assert.ok(err == null);
                });
        });
        it('return employees #3 as request GET /api/employees/3', () => {
            let error;

            supertest(app)
                .get('/api/employees/3')
                // .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    console.log(res.body);
                    assert.ok(res.body != null);
                    assert.ok(res.body.employee_id === 3);
                }).catch((err) => {
                    error = err;
                });
            assert.ok(error === null || error === undefined);
            console.log(error);
        });
    });
});
