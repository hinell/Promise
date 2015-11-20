var request = require('request');
    oath    = require('./');

    Oath(
      request.get.bind(request,'http://www.google.com'),
      request.get.bind(request,'http://www.example.com')
      )
    .then(function (googleErr,res,google,exmplErr,res,examplepage){
      console.log(google.toString());       // => google.com page
      console.log(examplepage.toString());  // => example.com page
    });
