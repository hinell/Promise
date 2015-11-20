module.exports = function (grunt) {
  ['grunt-contrib-uglify'
  ,'grunt-contrib-watch'
  ,'grunt-mocha-test'
  ,'grunt-simple-mocha'   ]
    .forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    uglify   : {
      distr: {
        options: {sourceMap:true,sourceMapName:'./lib/oath.min.map'},
        files: {'./lib/oath.min.js': './lib/oath.js'}
      }
    },
    mochaTest: {
      options: {
        reporter         : 'spec',
        clearRequireCache: true
      },
       oath     : {options:{require: function(){ Oath = require('./lib/oath.js'    )  }},src:['./lib/*.test.js']},
      'oath.min': {options:{require: function(){ Oath = require('./lib/oath.min.js')  }},src:['./lib/*.test.js']}
    },
    watch    : {
      tests: {
        options: {
          spawn    : true,
          interrupt: true,
          //debounceDelay: 500,
          reload   : true
        },
        tasks  : ['test'],
        files  : ['gruntfile.js','./**/*.test.js', './index.js']
        }
    }
   }
  );
  grunt
    .registerTask('distr'      , ['uglify:distr'])
    .registerTask('distr:test' , ['mochaTest:oath.min'])

    .registerTask('test'       , ['mochaTest:oath'])
    .registerTask('test:live'  , ['watch:tests'])
    .registerTask('default'    , ['test:live']);
};
