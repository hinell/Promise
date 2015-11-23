/* Usage: npm i request && node examples/page | clip
* Then just open up in the browser (ctrl+v into the url input form) resulting string.
* Troubleshooting:
* There is clip command that is specific only for windows platforms.
* If you are not using windows solution is just to save string result into a file i.e. by node examples/page > result.txt
* and then just copy it out into a system clipboard by using ctrl+c keys combination. */
request = require('request');
new require('../lib/oath.min.js')(
   request.bind(null,'https://cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js')
  ,request.bind(null,'https://avatars1.githubusercontent.com/u/8136158?v=3&u=3706d0cc863ee23f15ab9ef5fd3b46cdb11f77cf&s=140',{encoding:null})
  ,'This example shows how to deal with two async https request '
  +'sent to an image and script files and two non-async objects that just has been passed into the promise as arguments. '
  +'Most of the hard work you need to do with promises is done by Oath itself so feel free to hack it. Enjoy. '
  ,function (resolve) {
    resolve(function (imgurl,message) {
      return ''
        +'<html>'
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
    })
  }
).then(function (
  a,b,base64str
  ,c,d,image
  ,message
  ,createPage){
  var Base64 = {};
  new Function('exports',base64str)(Base64);
  console.log('data:text/html;base64,'+Base64.btoa(createPage('data:image/png;base64,' + Base64.btoa(image.toString('binary')),message)))
});


