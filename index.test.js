expect      = require('expect.js');
oath        = require('./index.js');
describe('Oath modulest tests'  , function () {
  describe('it works fine with' ,function(){
    it('common.js modules', function () {
      expect(oath).to.be.an('function')
    });
    it('browser\'s global', function () {
      new Function(''
        +'global.window = {};\r\n'
        +require('fs').
        readFileSync('./index.js',{encoding:'utf8'})
      ).call();
      expect(window.oath).to.be.a('function')

    });
    it('AMD modules')
  });
});

Oath      = require('./index.js');
describe('Creating of the new Oath object with', function () {
  describe('a single targeted postpone call', function () {
    it('resolves promise by passing result into then() handler' ,function () {
      new Oath(function (resolve) {
        setTimeout(function () { resolve('ok') },100)
      }).then(function (ok) {
        expect(ok).to.eql('ok')
      })
    });
    it('reassigns then() handler by each invocation of then()'  ,function (done) {
      new Oath(function (resolve) {
        setTimeout(function () { resolve('ok') },100)
      }).then(function () {
        done(new Error('Expected then() handler to be not called!'))
      }).then(function (ok) {
        expect(ok).to.eql('ok')
      })
    });
    it('rejects promise by an Error argument and passes its instance into catch() handler',function(){
      new Oath(function (resolve,reject) {
        setTimeout(function () {
          reject(new Error('error'));
          },100)
      })
      .catch(function (error) {
        expect(error.message).to.eql('error')
      })
    });
    it('not calls catch()\'s handler if promise is resolved' ,function(done){
      new Oath(function (resolve,reject) {
        setTimeout(function () { resolve('ok') },100)
      }).then (function () { done()})
        .catch(function () { done(new Error('Expected catch() handler to be not called!'))})
    });
    it('not calls then()\'s handler if promise is rejected'  ,function(done){
      new Oath(function (resolve,reject) {
        setTimeout(function () { reject('fail') },100)
      }).catch  (function () { done() })
        .then   (function () { done(new Error('Expected then() handler to be not called if promise was rejected ')) })
    });
    it('chaines then()\'s  handlers returns after the promise resolving',function(done){
      new Oath(function () {
       setTimeout(function () { resolve('ok') },100)
      }).then(function (ok) {
        ok || done(new Error('Expected the promise is passing a resolved value into the first nearest then() handler'));
        return {ok:ok}
      }).then(function (obj) {
        obj.ok || done(new Error('Expected the return value being of the first then() handler being into a second'));
        done()
      })
    });
    it('chaines catch()\'s handlers returns after the promise rejecting',function(done){
      new Oath(function () {
       setTimeout(function () { reject('fail') },100)
      }).catch(function (fail) {
          fail || done(new Error('Expected an rejected value'));
          return {result:'result of a catching'}
      }).then(function (obj) {
        obj.result || done(new Error('Expected value being passed into the then() handler retrieved out of the catch\'s handler return'));
        done()
      })
    });
  });
});
