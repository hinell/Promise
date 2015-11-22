request = require('request');
Oath    = require(require('./package.json').main);
Oath(
    request.bind(null,'https://cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js')
   ,request.bind(null,'https://avatars1.githubusercontent.com/u/8136158?v=3&u=3706d0cc863ee23f15ab9ef5fd3b46cdb11f77cf&s=140',{encoding:null})
   ,'This page and image above are both result of an '
   +'asynchronous Base64 script and image downloading, '
   +'processing and serialization that accomplished by '
   +'demonstrated Oath capabilities.'
   , function (resolve) {
    var page = function (imgurl,message) {
      return '<html>'
        +'<head>'
        +'</head>'
        +'<body>'
          +'<style>'
          +'@import url(https://fonts.googleapis.com/css?family=Quicksand);'
          +'body {'
          +'font-family: "Quicksand", sans-serif;'
          +'font-size: small;'
          +'width: auto;'
          +'max-width: 25em;'
          +'margin: auto;'
          +'margin-top: 10em;'
          +'text-align: center;'
          +'}'
          +'</style>'
        +'<link href="https://cdnjs.cloudflare.com/ajax/libs/marx/1.3.0/marx.min.css">'
        +'<a href="https://github.com/hinell" ><img src="'+imgurl+'"></a>'
        +'<h2>'+message+'</h2>'
        +'</body>'
        +'</html>'
    };
    resolve(page)
   }
).then(function (
     a,b,base64str
    ,c,d,image
    ,message
    ,page){
var Base64 = {};
new Function('exports',base64str)(Base64);
    console.log('data:text/html;base64,'+Base64.btoa(page('data:image/png;base64,' + Base64.btoa(image.toString('binary')),message)));
});
