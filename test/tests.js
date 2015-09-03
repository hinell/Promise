expect  = require('expect.js');
load    = require.bind(module,'..')

describe('require("oath")',function () {
  oath = load();
  describe('should have',function () {

    it('.Promise', function () {
      expect(oath).to.have.key('Promise')
    })
    it('.When',function(){
      expect(oath).to.have.key('When')
    })
  })

  describe('where Promise should have',function(){
    it('.deferr', function () {
      it('.Promise',function(){
        expect(oath.Promise).to.have.be.a('function')
      });

    })


  })

});

describe('Oath',function(){
  // as main method
  it('()',function(done){
    oath = load();
    oath(function (resolve) {
      setTimeout(resolve, 1500)
    }).then(function () {
        done()
      })
  })

})
