# Promise
Simple native javascript for iojs, nodejs and browser micro [Promise A+](https://promisesaplus.com/) compliant implementation.

---
```
$ npm i hinell/oath-js
```
```javascript
//  example.js
//  before usage run: npm i request
var request = require('request');
    oath    = require('oath-js');
    oath(function (resolve) {
    oath(request.get.bind(request,'http://www.google.com'))
    .then(function (err,res,googlepage){
      console.log(googlepage.toString()); // => google.com page
    });
```
```javascript
// Express examples
oath({some:'data'}).then(function(data){data.some}) // => 'data'
oath(function(resolve){setTimeout(function(){resolve.('Deferred 1') })},
     function(resolve){setTimeout(function(){resolve.('Deferred 2') })})
.then(function(d,d2){}) // d => 'Deferred 1', d2 => 'Deferred 2'
                        // order of passed aruments is always ensured
  
oath(new Error('myError'))       .catch(function(err){}) // err.message => 'myError'
oath(new Error('myError'),'info').then(function(err,info){})  // err.message => 'myError', info => 'info'
```
```javascript
//  Want more? Let's take a glance at this:
var deferredUser = {name:'foo',adress:'boo'}
    oath(
      deferredFunction,// Function - Any data types are allowed here. One or more.
      deferredUser,    // Object   - If deferred object isn't a function, it will be handled as
      anotherFunction) //            a callback and immediately passed into appropriate listeners 
    .then(thenListener)//            through a resolve(deferredObject) callback
    .catch(errListener)              

    function deferredFunction(resolve,promise){
    //  If deferred  is a function object and once you have your deferred stuff became available to use
    //  you should always call resolve method with passed into your deferred result, i.e.
        resolve('some data here!');
        return                           // More about resolve(): 
        resolve()                        // This will just initialize all then listeners
        resolve(new Error('err'),'info') // This initialize all error listeners only if
                                         // number of deferred objects is one
                                         // if number of those object is more than one - 
                                         // initialize all then listeners
    }
    function anotherFunction (resolve,promise){ 
        resolve.apply(promise,[{data:'here is example where we can apply a resolve method by .apply()'}])
        }
//  And results handling        
    function thenListener (fnData,user,someData){
        fnData    // => 'some data here!'
        user      // => {name:'foo',adress:'boo'}
        someData  // => {data:'here is example where we can apply a resolve method by .apply()'}
    }
  

```
|Why?|*Just for fun!* :v: |
|-----|----|
