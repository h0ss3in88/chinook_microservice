const {connect} = require('../utils/repository'),
      {connector} = require('../utils/dbConnection'),
      config = require('../configs/config'),
      {EventEmitter } = require('events'),
      assert = require('assert');
      let mediator = new EventEmitter();
      let repository;
describe('repository',() => {
    before((done) => {
        mediator.on('db.ready',(db) => {
            connect(db).then((repo) => {
                repository =  repo;
                done();
            }).catch(err => {
                done(err);
            });
        });
        connector(mediator);
        mediator.emit('db.connect', config);
    });
    describe('get movie by id',()=> {
        it('movie number 1 return',(done) => {
            repository.getCustomerById(1).then(result => {
                assert(result.film_id == 1);
                done();
            });
        });
    });
});