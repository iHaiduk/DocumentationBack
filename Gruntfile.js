/**
 * Gruntfile
 *
 * This Node script is executed when you run `grunt` or `sails lift`.
 * It's purpose is to load the Grunt tasks in your project's `tasks`
 * folder, and allow you to add and remove tasks as you see fit.
 * For more information on how this works, check out the `README.md`
 * file that was generated in your `tasks` folder.
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Check out the `tasks` directory instead.
 */

module.exports = function(grunt) {

    grunt.initConfig({
        coffee: {
            Application: {
                options: {
                    bare: true
                },
                expand: true,
                flatten: true,
                cwd: 'coffee/Application',
                src: ['*.coffee'],
                dest: 'public/js/Application',
                ext: '.js'
            },
            Node: {
                options: {
                    bare: true
                },
                expand: true,
                flatten: true,
                cwd: 'coffee/node',
                src: ['*.coffee'],
                dest: '',
                ext: '.js'
            },
            NodeApplication: {
                options: {
                    bare: true
                },
                expand: true,
                cwd: 'coffee/node',
                src: ['application/**/*.coffee'],
                dest: '',
                ext: '.js'
            },
            main: {
                options: {
                    bare: true
                },
                expand: true,
                flatten: true,
                cwd: 'coffee',
                src: ['*.coffee'],
                dest: 'public/js',
                ext: '.js'
            }
        },
        watch:{
            options:{
                livereload: true
            },
            scripts:{
                files: ['coffee/Application/*.coffee', 'coffee/*.coffee', 'coffee/node/*.coffee', 'coffee/node/application/**/*.coffee'],
                tasks: ['newer:coffee:Application','newer:coffee:main','newer:coffee:Node','newer:coffee:NodeApplication']
            }
        },
        js2coffee: {
            each: {
                options: {},
                files: [
                    {
                        expand: true,
                        cwd: 'public/js/Application',
                        src: ['**/*.js'],
                        dest: 'coffee/_tempCoffee/Application',
                        ext: '.coffee'
                    },
                    {
                        expand: true,
                        cwd: 'public/js/Collections',
                        src: ['**/*.js'],
                        dest: 'coffee/_tempCoffee/Collections',
                        ext: '.coffee'
                    },
                    {
                        expand: true,
                        cwd: 'public/js/Models',
                        src: ['**/*.js'],
                        dest: 'coffee/_tempCoffee/Models',
                        ext: '.coffee'
                    },
                    {
                        expand: true,
                        cwd: 'public/js/Views',
                        src: ['**/*.js'],
                        dest: 'coffee/_tempCoffee/Views',
                        ext: '.coffee'
                    },
                    {
                        expand: true,
                        cwd: '',
                        src: ['*.js'],
                        dest: 'coffee/_tempCoffee/node',
                        ext: '.coffee'
                    },
                    {
                        expand: true,
                        cwd: 'public/js/',
                        src: ['*.js'],
                        dest: 'coffee/_tempCoffee',
                        ext: '.coffee'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-forever');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-js2coffee');

    grunt.registerTask('default', ['coffee:Application','coffee:Node','coffee:main','coffee:NodeApplication','watch']);

};