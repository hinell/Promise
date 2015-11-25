    request = require('request');
    load    = function(url){ return  request.bind(null,url) };
    Oath    = require('../src/oath.min.js');
new Oath(load('https://google.com'),
         load('http://example.com/'))
  .then(function (e,r,google,e,r,example) {
    console.log(google); // => google page
    console.log(example);// => example page
  });
