request = require('request');
new require('../lib/oath.min.js')(
  request.bind(null,'https://google.com'),
  request.bind(null,'http://example.com/')
).then(function (a,b,google,a,b,example) {
  console.log(google); // => google page
  console.log(example);// => example page
});
