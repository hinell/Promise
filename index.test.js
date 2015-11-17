/* Todo: tests for non-async targets */

expect      = require('expect.js');
Oath        = require('./index.js');
describe('Oath modules tests'  , function () {
  describe('it works fine with' ,function() {
    it('common.js modules', function () {
      expect(Oath).to.be.an('function')
    });
    it('browser\'s global', function () {
      new Function(''
        +'global.window = {};\r\n'
        +require('fs').
        readFileSync('./index.js',{encoding:'utf8'})
      ).call();
      expect(window.Oath).to.be.a('function')

    });
    it('AMD modules')
  });
});
describe('Creation of the new Oath (Promise) object with', function () {
  describe('a single postpone parameter: '  , function () {
    it('passes resolved value into the first then()\'s handler which should return value into the next and so on'   , function(done) {
      new Oath(function (resolve) { setTimeout(function () { resolve('foo') },100) })
          .then(function (foo) { expect(foo).to.eql('foo'); return 'bar'})
          .then(function (bar) { expect(bar).to.eql('bar'); done()})
    });
    it('passes rejected value into the catch handler which provides return as parameter of the next then() handler and so on' , function(done) {
      new Oath(function (resolve,reject) { setTimeout(function () { reject(new Error('error'))},100) })
          .catch(function () { done(new Error('Expected first catch() handler to be not called because it should be reassigned by second!'))})
          .catch(function (error) { console.log(error[0] instanceof Error); expect(error.message).to.eql('error'); return 'catchReturn'})
          .then (function (catchResult) { expect(catchResult).to.eql('catchReturn');done() })
    });

    it('not calls catch()\'s handler if promise is already resolved'  , function(done){
      new Oath(function (resolve,reject){ setTimeout(function () { resolve('ok') },100) })
          .catch(function () { done(new Error('Expected catch() handler to be not called!'))})
          .then (function () { done()})
    });
    it('not calls first then()\'s handler if promise was rejected'    , function(done){
      new Oath(function (resolve,reject) { setTimeout(function () { reject('fail') },100) })
          .then (function () { done(new Error('Expected first then()\'s handler to be not called if promise was rejected ')) })
          .catch(function () { return 'foo' })
          .then (function (foo) { expect(foo).to.eql('foo'); done() })
    });
  });
  describe('a several parameters: '         , function () {
    it.skip('fires then()\'s handlers with result provided by target resolving', function () {  })
  })
});
