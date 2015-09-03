expect  = require('expect.js');
load    = require.bind(module,'..')

describe('require("oath")',function () {
  oath = load();
  describe('should have',function () {
  
    it('[funciton]',function () {

      expect(oath).to.be.a('function')
    });
    it('.Promise',function(){
      expect(oath).to.have.key('Promise')
    });
    it('.When',function(){
      expect(oath).to.have.key('When')
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
