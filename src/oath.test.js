/* Oath is imported by a custom grunt loader*/
expect      = require('expect.js');
describe('Oath modules tests'  , function () {
  var OathSource =  require('fs').readFileSync(Oath.path,{encoding:'utf8'})
  describe('it works fine with' ,function() {
    it('common.js modules', function () {
      var module = {exports: void 0};
      new Function('module', OathSource)(module);
          expect(module.exports).to.be.an('function')
    });
    it('browser\'s global', function () {
      var window = {Oath: void 0};
      new Function('module','window', OathSource)(false,window);
          expect(window.Oath).to.be.an('function')
    });
    it('AMD modules'      , function () {
      var module = {exports: void 0};
      var OathAMD= void 0;
      var define = function (modulename,fn) {
          OathAMD = fn(void 0,module.exports,module);
      };
      new Function('define', OathSource)(define);
          expect(OathAMD).to.be.an('function')

    })
  });
});
describe('Creation of the new Oath (Promise) object with', function () {
  describe('a single sync parameter: '        , function () {
    it('resolves values immediately',function(done){
      new Oath(function (resolve,reject) { resolve('val') })
        .then(function (val) { expect(val).to.eql('val');done() })
    });
    it('rejectes values immediately',function(done){
      new Oath(function (resolve,reject) { reject('err') })
        .catch(function (val) { expect(val).to.eql('err');done() })
    });
  });
  describe('a single async parameter: '       , function () {
    it('in standalone mode (without target set up) resolves|rejectes value by manual call' , function(done){
          expect(Oath).to.not.throwException();
      var promise = Oath();
          setTimeout  (function (   ) { promise.resolve('val') },10);
          promise.then(function (val) { expect(val).to.be.eql('val'); done() });
    });
    it('passes resolved value into the first then()\'s handler which should return value into the next and so on'
    ,function(done) {
         new Oath(function (resolve) { setTimeout(function () { resolve('foo') },50) })
           .then(function (foo) { expect(foo).to.eql('foo'); return 'bar'})
           .then(function (bar) { expect(bar).to.eql('bar'); done()})
       });
    it('passes rejected value into the catch handler which provides return as parameter of the next then() handler and so on'
    ,function(done) {
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

  describe('a several sync parameters: '      , function() {
    it('resolves all values immediately',function(done){
      new Oath(
         function (resolve,reject) { resolve('val')}
        ,function (resolve,reject) { reject('err')})
        .then(function (val,err) {
          expect(val).to.eql('val');
          expect(err).to.eql('err');
          done()
        })
    });
  });
  describe('a several async parameters: '     , function () {

    it('fires then()\'s handlers with resolved results', function (done) {
    new Oath(
        function (resolve,reject){ setTimeout(function () { resolve('foo') },10) },
        function (resolve,reject){ setTimeout(function () { resolve('bar') },25) }
      ).then(function (foo,bar) {
        expect(foo).to.eql('foo');
        expect(bar).to.eql('bar');
        done()
      })
    });

    it('fires then()\'s handlers with rejected results', function (done) {
    new Oath(
        function (resolve,reject){ setTimeout(function () {reject('foo') },10) },
        function (resolve,reject){ setTimeout(function () {reject('bar') },25) }
      ).then(function (foo,bar) {
        expect(foo).to.eql('foo');
        expect(bar).to.eql('bar');
        done()
      })
    });

    it('resolves value into a first then() handler and then passes its return a second and so on' , function (done) {
    new Oath(
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
    new Oath(
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
    new Oath(
        function (resolve,reject){ setTimeout(function () {resolve('foo') },10) },
        function (resolve,reject){ setTimeout(function () {reject('bar') },25) }
      ).then(function (foo,bar) {
        expect(foo).to.eql('foo');
        expect(bar).to.eql('bar');
        done()
      })

    });
    it('resolves a sync objects' , function (done) {
    new Oath('foo','bar')
        .then(function (foo,bar) {
          expect(foo).to.eql('foo');
          expect(bar).to.eql('bar');
          done()
        })
    });

    it('fires then()\'s handlers with results of mixed targets consisted of sync and async objects' ,
       function (done) {
       new Oath(
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
  });
});
