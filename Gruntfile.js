module.exports = function (grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-package-modules');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-multi-dest');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    clean: ['dist'],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.ts', '!**/*.scss', '!img/*'],
        dest: 'dist'
      },

      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/**/*'],
        dest: 'dist/'
      },

      pluginDef: {
        expand: true,
        src: ['plugin.json'],
        dest: 'dist',
      }
    },


    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json', 'README.md', '!src/node_modules/**', '!src/bower_components/**'],
        tasks: ['default'],
        options: {spawn: false}
      },
    },

    babel: {
      options: {
        ignore: ['**/bower_components/*', '**/external/*', "**/src/libs/*"],
        sourceMap: true,
        presets: ["es2015"],
        plugins: ['transform-es2015-modules-systemjs', "transform-es2015-for-of"],
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      },
    },
  });
  grunt.registerTask('default', [
    'clean',
    'copy:src_to_dist',
    'copy:img_to_dist',
    'copy:pluginDef',
    'babel'
  ]);
};