expect = require('expect.js');
describe('require("oath")',function () {
  deferred = require('..');
  describe('should have',function () {
    it('[funciton]',function () {

      expect(deferred).to.be.a('function')
    })
    it('.Promise',function(){
      expect(deferred).to.have.key('Promise')
    })
    it('.When',function(){
      expect(deferred).to.have.key('When')
    })
  })
})


