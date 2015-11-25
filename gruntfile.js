module.exports = function (grunt) {
  ['grunt-contrib-uglify'
  ,'grunt-contrib-watch'
  ,'grunt-mocha-test'
  ,'grunt-simple-mocha'   ]
    .forEach(grunt.loadNpmTasks);
  grunt.config.init({
     uglify   : {
      distr: {
        options: {sourceMap:true,sourceMapName:'./src/oath.min.map',banner: '/*Copyright hinell@github.com 2015. | https://github.com/hinell/oath-js | <%= grunt.template.date(Date.now(),"yy.mm.dd") %>*/'},
        files: {'./src/oath.min.js': './src/oath.js'}
      }
    }
    ,mochaTest: {
      options: {
        reporter         : 'spec',
        clearRequireCache: true
      },
       oath     : {
        options:{
          require: function(){
          var path = './src/oath.js';
              Oath = require(path);
              Oath.path = path
              }},
          src:['./src/*.test.js']},
      'oath.min': {
        options:{
          require: function(){
          var path = './src/oath.min.js';
              Oath = require(path);
              Oath.path = path
          }},
          src:['./src/*.test.js']}
    }
    ,watch    : {
      tests: {
        options: {
          spawn    : true,
          interrupt: true,
          //debounceDelay: 500,
          reload   : true
        },
        tasks  : ['dev:test'],
        files  : ['gruntfile.js','./src/*.test.js', './src/*.js']
        }
    }
   }
  );
  grunt
    .registerTask('distr'      , ['uglify:distr'])
    .registerTask('distr:test' , ['mochaTest:oath.min'])

    .registerTask('dev:test'        , ['mochaTest:oath' ])
    .registerTask('dev:test:live'   , ['watch:tests'    ])
    .registerTask('default'         , ['dev:test:live'  ]);
};
