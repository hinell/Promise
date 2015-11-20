/* Oath is imported by a custom grunt loader*/
expect      = require('expect.js');
describe('Oath modules tests'  , function () {
  describe('it works fine with' ,function() {
    it('common.js modules', function () {
      expect(Oath).to.be.an('function')
    });
    it('browser\'s global', function () {
      new Function(''
        +'global.window = {};\r\n'
        +require('fs').
        readFileSync(Oath.path,{encoding:'utf8'})
      ).call();
      expect(window.Oath).to.be.a('function')

    });
    it('AMD modules')
  });
});
describe('Creation of the new Oath (Promise) object with', function () {
  describe('a single postpone parameter: '        , function () {
    it('passes resolved value into the first then()\'s handler which should return value into the next and so on'             ,
       function(done) {
         new Oath(function (resolve) { setTimeout(function () { resolve('foo') },50) })
           .then(function (foo) { expect(foo).to.eql('foo'); return 'bar'})
           .then(function (bar) { expect(bar).to.eql('bar'); done()})
       });
    it('passes rejected value into the catch handler which provides return as parameter of the next then() handler and so on' ,
       function(done) {
         new Oath(function (resolve,reject) { setTimeout(function () { reject(new Error('error'))},50) })
           .catch(function () { done(new Error('Expected first catch() handler to be not called because it should be reassigned by second!'))})
           .catch(function (error) { expect(error.message).to.eql('error'); return 'catchReturn'})
           .then (function (catchResult) { expect(catchResult).to.eql('catchReturn');done() })
       });

    it('not calls catch()\'s handler if promise is already resolved'  , function(done){
      new Oath(function (resolve,reject){ setTimeout(function () { resolve('ok') },50) })
        .catch(function () { done(new Error('Expected catch() handler to be not called!'))})
        .then (function () { done()})
    });
    it('not calls first then()\'s handler if promise was rejected'    , function(done){
      new Oath(function (resolve,reject) { setTimeout(function () { reject('fail') },50) })
        .then (function () { done(new Error('Expected first then()\'s handler to be not called if promise was rejected ')) })
        .catch(function () { return 'foo' })
        .then (function (foo) { expect(foo).to.eql('foo'); done() })
    });

    it('resolves a sync object', function (done) {
      new Oath('value')
        .then(function (value) { expect(value).to.eql('value'); done()})

    })
  });
  describe('a several postpone parameters: '      , function () {

    it('fires then()\'s handlers with resolved results', function (done) {
      Oath.all(
        function (resolve,reject){ setTimeout(function () { resolve('foo') },10) },
        function (resolve,reject){ setTimeout(function () { resolve('bar') },25) }
      ).then(function (foo,bar) {
        expect(foo).to.eql('foo');
        expect(bar).to.eql('bar');
        done()
      })
    });

    it('fires then()\'s handlers with rejected results', function (done) {
      Oath.all(
        function (resolve,reject){ setTimeout(function () {reject('foo') },10) },
        function (resolve,reject){ setTimeout(function () {reject('bar') },25) }
      ).then(function (foo,bar) {
        expect(foo).to.eql('foo');
        expect(bar).to.eql('bar');
        done()
      })
    });

    it('resolves value into a first then() handler and then passes its return a second and so on' , function (done) {
      Oath.all(
        function (resolve,reject){ setTimeout(function () { resolve('foo') },10) }
        ,function (resolve,reject){ setTimeout(function () { reject ('bar') },10) }
      ) .then(function (foo,bar) {
        expect(foo).to.eql('foo');
        return bar
      }).then(function (bar) {
        expect(bar).to.eql('bar');
        done()
      })
    });

    it('keeps order of rejected and resolved values' , function (done) {
      Oath.all(
        function (resolve,reject){ setTimeout(function () { resolve('res','foo') },10) },
        function (resolve,reject){ setTimeout(function () { reject ('rej','bar') },10) }
      ).then(function (res,foo,rej,bar) {
        res === 'res' &&
        foo === 'foo' &&
        rej === 'rej' &&
        bar === 'bar' && done()
      })
    });

    it('fires then()\'s handlers with rejected and resolved results', function (done) {
      Oath.all(
        function (resolve,reject){ setTimeout(function () {resolve('foo') },10) },
        function (resolve,reject){ setTimeout(function () {reject('bar') },25) }
      ).then(function (foo,bar) {
        expect(foo).to.eql('foo');
        expect(bar).to.eql('bar');
        done()
      })

    });
    it('resolves a sync objects' , function (done) {
      Oath.all('foo','bar')
        .then(function (foo,bar) {
          expect(foo).to.eql('foo');
          expect(bar).to.eql('bar');
          done()
        })
    });

    it('fires then()\'s handlers with results of mixed targets consisted of sync and async objects' ,
       function (done) {
         Oath.all(
           function (resolve,reject){ setTimeout(function () { resolve('first') },25) }
           ,'second'
           ,function (resolve,reject){ setTimeout(function () { reject('third') },50) }
           ,'fourth'
         ).then(function (first,second,third,fourth) {
           first  === 'first'  &&
           second === 'second' &&
           third  === 'third'  &&
           fourth === 'fourth' && done()
         })
       })
  })
});
