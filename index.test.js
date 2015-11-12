expect      = require('expect.js');
oath        = require('./index.js');
describe('Oath environment test', function () {

  it('Node.js environment [ >=0.12.7]', function () {
    expect(oath).to.be.a('function')

  });
  it('Browser environment', function () {
    new Function(''
      +'global.window = {};\r\n'
      +require('fs').
       readFileSync('./index.js',{encoding:'utf8'})
    ).call();
    expect(window.oath).to.be.a('function')

  });
});

oath      = require('./index.js');
deferred  = function () {
  var args = [].slice.call(arguments);
  var delay= args.pop();
  return function (resolve) {
    setTimeout(function () {
      args.length === 0 && resolve();
      args.length === 1 && resolve(args[0]);
      args.length === 2 && resolve(args[0],args[1]);
      args.length === 3 && resolve(args[0],args[1],args[2]);
      args.length === 4 && resolve(args[0],args[1],args[2],args[3])
    },delay || 0) };
};

describe('oath.Promise.defer',function(){
  it('then postpone call', function (done) {
    oath(deferred('data1','data2',900))
      .then(function (data1,data2) {
              data1 === 'data1' && data2 === 'data2' &&  done()
            })
  });
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
});

describe('oath.Promise.when',function(){
  it('3 callbacks postpone w/o err',function(done){
    oath(
      deferred('1',300),
      deferred('2',600),
      deferred('3',300))
      .then(function (d1, d2, d3) {
              d1 === '1' &&
              d2 === '2' &&
              d3 === '3' && done()
            })
  });
  it('2 callbacks postpone w error',function(done){
    oath(
      deferred({error: new Error('1'),data: 'some data here 1'},300),
      deferred({error: new Error('2'),data: 'some data here 2'},500))
      .then(function (data1, data2) {
              data1.error.message === '1' &&
              data2.error.message === '2' &&
              data1.data === 'some data here 1' &&
              data2.data === 'some data here 2' &&
              done()
            })
  });
  it('2 objects', function (done) {

    oath({d:'one'},{d:'two'},{d:'three'})
    //oath({d:'one'},{d:'two'})
      .then(function (f,s,t) {
        f.d === 'one' &&
        //s.d === 'two' && done();
        s.d === 'two' &&
        t.d === 'three' && done()

      })


  })

});
