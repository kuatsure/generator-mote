# Generated on <%= (new Date).toISOString().split('T')[0] %> using
# <%= pkg.name %> <%= pkg.version %>

module.exports = ( grunt ) ->
  # show elapsed time at the end
  require( 'time-grunt' ) grunt
  # load all grunt tasks
  require( 'load-grunt-tasks' ) grunt

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    bower: grunt.file.readJSON 'bower.json'

    config:
      app:      '.'
      dist:     '.'<% if ( includeScripts || includePages ) { %>

    watch:
      gruntfile:
        files: [ 'Gruntfile.coffee' ]<% if ( includeScripts ) { %>

      scripts:
        files: [ '<%%= config.app %>/scripts/**/*' ]
        tasks: [<% if ( !includeCoffeeScript ) { %>
          'jshint'<% } %><% if ( includeCoffeeScript ) { %>
          'coffeelint'
          'coffee'<% } %>
          'replace:scripts'
        ]<% } %><% if ( includePages ) { %>

      pages:
        files: [ '<%%= config.app %>/pages/**/*' ]
        tasks: [ 'replace:pages' ]<% } %>

    clean:
      all:
        src: '<%%= config.dist %>/*.{<% if ( includeScripts ) { %>js<% } %><% if ( includeScripts && includePages ) { %>,<% } %><% if ( includePages ) { %>html<% } %>}'<% if ( !includeCoffeeScript ) { %>

    jshint:
      options:
        'jshintrc': true
        reporter: require 'jshint-stylish'
      files:
        src: ['<%%= config.app %>/scripts/*.js']<% } %><% if ( includeCoffeeScript ) { %>

    coffeelint:
      options:
        'max_line_length':
          'level': 'ignore'
        'no_empty_param_list':
          'level': 'error'
      files: [ '<%%= config.app %>/scripts/*.coffee' ]

    coffee:
      options:
        bare: true
      jitter:
        files:
          '<%%= config.dist %>/<%%= pkg.name %>.js': [ '<%%= config.app %>/scripts/*.coffee' ]<% } %>

    replace:
      options:
        patterns: [
          match: 'NAME'
          replacement: '<%%= pkg.name %>'
        ,
          match: 'VERSION',
          replacement: '<%%= pkg.version %>'
        ,
          match: 'DATE'
          replacement: '<%%= grunt.template.today(\'yyyy-mm-dd\') %>'
        ,
          match: 'YEAR'
          replacement: '<%%= grunt.template.today(\'yyyy\') %>'
        ]<% if ( includeScripts ) { %>
      scripts:
        files: [
          expand: true
          flatten: true
          src: [ <% if ( !includeCoffeeScript ) { %>'<%%= config.app %>/scripts/<%%= pkg.name %>.js'<% } %><% if ( includeCoffeeScript ) { %>'<%%= config.dist %>/<%%= pkg.name %>.js'<% } %> ]
          dest: '<%%= config.dist %>'
        ]<% } %><% if ( includePages ) { %>
      pages:
        files: [
          expand: true
          flatten: true
          src: [ '<%%= config.app %>/pages/*.html' ]
          dest: '<%%= config.dist %>'
        ]<% } %><% } %>

    bump:
      options:
        updateConfigs: [ 'pkg' ]
        pushTo: 'origin'
        files: [
          'package.json'
          'bower.json'
        ]
        commitFiles: [
          'package.json'
          'bower.json'<% if ( includeScripts ) { %>
          '<%%= config.dist %>/<%%= pkg.name %>.js'<% } %><% if ( includePages ) { %>
          '<%%= config.dist %>/<%%= pkg.name %>.html'<% } %>
        ]

  grunt.registerTask 'default', [<% if ( includeScripts || includePages ) { %>
    'clean'<% if ( !includeCoffeeScript ) { %>
    'jshint'<% } %><% if ( includeCoffeeScript ) { %>
    'coffeelint'
    'coffee'<% } %>
    'replace'<% } %>
  ]

  grunt.registerTask 'ship', 'Version bumps <%= _.slugify(projectName) %>, commits, tags then pushes to origin', ( version ) ->
    version ?= 'patch'

    grunt.task.run [
      "bump-only:#{version}"<% if ( includeCoffeeScript ) { %>
      'coffee'<% } %><% if ( includeScripts || includePages ) { %>
      'replace'<% } %>
      'bump-commit'
    ]
