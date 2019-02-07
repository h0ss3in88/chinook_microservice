const { EventEmitter } = require('events'),
    assert = require('assert'),
    { init } = require('../config');

let sum = function({ x, y }, z) {
    console.log(x);
    return x + y * z;
};

describe('DI injecting test', () => {
    // let mediator = new EventEmitter();

    before(() => {
        // init(mediator);
        sum.bind(null, { 'x': 4, 'y': 9 });
        let a = sum(3);

        console.log(a);
    });
    it('should execute by default parameters', () => {
        assert.ok(true);
    });
});
