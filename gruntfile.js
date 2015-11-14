module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch'  );
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
        src    : ['./*.test.js']
      }
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
  grunt.registerTask('test'     , ['mochaTest:oath']);
  grunt.registerTask('test:live', ['watch:tests']);
  grunt.registerTask('default'  , ['test:live'])
};
