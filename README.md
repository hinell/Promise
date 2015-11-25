# Oath 
[/A+ compliant](https://promisesaplus.com/) Promise implementation.<br>

_Concise, light, neat_.<br>
All about ~200 lines of code packed into an 6 KB (or 3 being gzipped) file in size.<br>
Very ligthweight in comparison to Q, Q-angular, jQuery Promise or any else implementation.<br>
Conformed with AMD, commonjs and browser modules formats, webpack optimazed and fully covered by tests

-
```shell
Usage  : $ npm i hinell/oath-js --production
Bower  : $ bower install hinell/oath-js
Browser: <script src="path/to/lib/oath.min.js"  type="text/javascript"></script>
AMD    : define(['Oath'],function(Oath){ new Oath() })
```
```shell
Supported platforms:
Node.js 0.12.7+
Opera 12.10+
Firefox 21+
Chrome 23+
IE9+ (IE8 and < require polyfills)
```
```javascript
// Short example.
// examples/google.js
// run: grunt distr && npm i request && node examples/google
   request = require('request');
   load    = function(url){ return  request.bind(null,url) };
   Oath    = require('../src/oath.min.js');
new Oath(load('https://google.com'),
         load('http://example.com/'))
  .then(function (a,b,google,a,b,example) {
    console.log(google); // => google page
    console.log(example);// => example page
  });
```
```
Follow to the examples/ folder if you want more hard of them.
```
##API Details
```javascript
promise = new Oath(obj[,obj]) // obj - function(resolve,reject){} | {object} - async or sync objects:
                              // If obj it is function, then it exptected to call resolve or reject callback.
                              // If obj is not - object will be resolved immediately.
```
```javascript
promise.then (callback)       // callback - Intended to be called when promise is resolved with provided values
                              // If amount of them more than one, they are passed into then() handler
                              // in the same order as they have been passed into the resolve() callback
promise.catch(callback)       // callback - Similar to the then()'s callback, but only for rejection.
                              // It is impossible to set more than one catch handler
                              // If before setting up catch() handler the then()'s handlers have been set up
                              // they are discarded.
```
```javascript
new Oath(function(resolve){ resolve('bar')  })
   .then(function(val    ){ return 'foo'+val}) // Promise chainening
   .then(function(foobar ){ foobar });         // foobar => 'foobar'

```
##Can't wait
```
1) Implement reflection of a first's promise instances then()'s|catch()'s
   handlers to allow them to be used by the next newly created and returned promise instance
   i.e. new Oath().then(function(){return new Oath()}).then(/* handler for the last promise instance */)
2) Provide XMLHttpRequest integration.
3) Polyfills.
```
