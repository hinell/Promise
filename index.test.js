expect = require('expect.js');
oath = require('./index.js');

// unnecessary tests
//var describe, it;
//describe('Oath', function () {
//
//  it('#When()', function () {
//    expect(oath).to.have.key('When')
//  })
//  it('#Promise()', function () {
//    expect(oath).to.have.key('Promise')
//  })
//
//  describe('.Promise', function () {
//    it('#contructor',function () {
//         expect(oath.Promise).to.be.a('function')
//       });
//
//    it('#defer()', function () {
//      expect(oath.Promise).to.have.key('defer')
//    });
//
//  })
//
//
//
//});


deferred  = function () {
  var args = [].slice.call(arguments);
  var delay= args.pop()
  return function (resolve) {
    setTimeout(function () {
      args.length === 0 && resolve()
      args.length === 1 && resolve(args[0])
      args.length === 2 && resolve(args[0],args[1])
      args.length === 3 && resolve(args[0],args[1],args[2])
      args.length === 4 && resolve(args[0],args[1],args[2],args[3])
    },delay || 0) };
}
to = function (fn) {  }

describe('oath() [oath.Promise.defer]',function(){
  it('then postpone call', function (done) {
    oath(deferred('data1','data2',900))
      .then(function (data1,data2) {
              data1 === 'data1' && data2 === 'data2' &&  done()
            })
  })
  it('catch/error postpone call',function (done) {
    oath(deferred(new Error('some error'),900))
      .then(function (err) {
              console.log('arguments err',arguments);
              done(new Error('callbeck passed into then function shouldn\'t be called if some error has been thrown!'))
            })
      .catch(function (err) {
               err && (err.message === 'some error') && done()
             })
  });

  it('during/progress repetition',function(done){
    var count = 0;
    oath(deferred(650))
      .during(function (intrv) {
                (count++ > 2) && (clearInterval(intrv),done());

              })

  })

})

describe('oath() [oath.Promise.when] ',function(){
  it('3 callbacks w/o err',function(done){
    oath(
      deferred('1',300),
      deferred('2',600),
      deferred('3',300))
      .then(function (d1, d2, d3) {
              d1.data === '1' &&
              d2.data === '2' &&
              d3.data === '3' && done()
            })
  })
  it('2 callbacks w error',function(done){
    oath(
      deferred(new Error('1'),'1',300),
      deferred(new Error('2'),'2',500))
      .then(function (data1, data2) {
              debug('then:arguments',arguments);
              //data1[0].message === '1' &&
              //data2[0].message === '2' &&
              //data1[1] === '1' &&
              //data2[1] === '2' && done()


              data1.error.message === '1' &&
              data2.error.message === '2' &&
              data1.data          === '1' &&
              data2.data          === '2' &&
              done()


            })
  })

})
