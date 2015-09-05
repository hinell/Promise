var request = require('request');
    oath    = require('./index.js');

    oath(request.get.bind(request,'http://www.google.com'))
    .then(function (err,res,googlepage){
      console.log(googlepage.toString()); // => google.com page
    });
