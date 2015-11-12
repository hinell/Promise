module.exports = function (grunt) {
grunt.loadNpmTasks('grunt-contrib-watch'    );
  grunt.loadNpmTasks('grunt-mocha-test'     );
  grunt.loadNpmTasks('grunt-simple-mocha'   );
  grunt.initConfig({
    mochaTest: {
      oath: {
        options: {
          reporter         : 'spec',
          //grep: 'defer',
          clearRequireCache: true
        },
        src    : ['./**/*.test.js']
      }
    },
    watch    : {
      tests: {
        options: {
          spawn    : false,
          interrupt: true,
          //debounceDelay: 250,
          reload   : true
        },
        tasks  : ['test'],
        files  : ['./**/*.test.js', './index.js']
        }
    }
   }
  );
  grunt.registerTask('test'     , ['mochaTest:oath']);
  grunt.registerTask('test:live', ['watch:tests']);
  grunt.registerTask('default'  , ['test:live'])
};
