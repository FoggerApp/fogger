/**
 * This Gruntfile specifies commands for our fogger project.
 * 
 * Running jasmine tests
 * ---------------------
 * Current the jasmine test command is not working because
 * our application runs on web2py. This would require a complex
 * headless environment that we might implement for the next iteration.
 * For now, tests can be run by navigating to a page and adding "test=1"
 * as a GET URL parameter.
 *
 * @module Grunt
 */
module.exports = function(grunt) {

    /**
     * @class GruntConfiguration
     */
    grunt.initConfig({

      	/**
         * Reads the package.json file.
         * @property pkg 
         */
        pkg: grunt.file.readJSON('package.json'),

       /**
        * Generates documentation for javascript source code,
        * test code and grunt file
        * @property yuidoc
        */
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: ['static/js', '.'],
                    outdir: 'docs'
                }
            }
       },

       /**
        * Attempts to run jasmine tests, but requires a headless
        * environment.
        * @property jasmine
        */
       jasmine: {
            compile: {
                src: 'static/js/*.js',
                options: {
                    specs: 'static/jasmine/spec/**/*Spec.js',
                    keepRunner: true
                }
            }
        },

        /**
         * Removes the docs folder and everything else generate by
         * this Gruntfile.
         * @property clean
         */
        clean:
            ['docs']
    });
 
    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['yuidoc', 'jasmine']);

};
