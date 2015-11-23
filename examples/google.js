request = require('request');
load    = function(url){ return  request.bind(null,url) };
Oath    = require('../lib/oath.min.js');

new Oath(load('https://google.com'),
  load('http://example.com/'))
  .then(function (a,b,google,a,b,example) {
    console.log(google); // => google page
    console.log(example);// => example page
  });
