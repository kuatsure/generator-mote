'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var MoteGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('Your project has got to start somewhere. Thanks for starting with \'Mote\''));

    var prompts = [{
      name: 'projectName',
      message: 'Project Name',
      default: this.appname
    },{
      name: 'authorName',
      message: 'Author Name',
      default: 'me'
    },{
      name: 'authorEmail',
      message: 'Author Email',
      default: 'me@someplace.com'
    },{
      type: 'checkbox',
      name: 'features',
      message: 'What would you like?',
      choices: [{
        name: 'Scripts',
        value: 'includeScripts',
        checked: true
      },{
        name: 'Styles',
        value: 'includeStyles',
        checked: false
      },{
        name: 'Pages',
        value: 'includePages',
        checked: false
      }]
    }, {
      when: function (props) {
        return props.features.indexOf('includeScripts') !== -1;
      },
      type: 'confirm',
      name: 'coffeescript',
      value: 'includeCoffeeScript',
      message: '[ Scripts ] Would you like to use Coffeescript?',
      default: true
    }, {
      when: function (props) {
        return props.features.indexOf('includeStyles') !== -1;
      },
      type: 'confirm',
      name: 'sass',
      value: 'includeSass',
      message: '[ Styles ] Would you like to use Sass?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      var features = props.features;

      function hasFeature(feat) { return features.indexOf(feat) !== -1; }

      this.includeScripts = hasFeature('includeScripts');
      props.coffeescript ? this.includeCoffeeScript = props.coffeescript : this.includeCoffeeScript = false;

      this.includeStyles = hasFeature('includeStyles');
      props.sass ? this.includeSass = props.sass : this.includeSass = false;

      this.includePages = hasFeature('includePages');

      this.projectName = props.projectName;
      this.authorName = props.authorName;
      this.authorEmail = props.authorEmail;

      // console.log(props);
      // console.log(this);

      done();
    }.bind(this));
  },

  app: function () {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.copy('editorconfig', '.editorconfig');
  },

  scripts: function () {
    if (this.includeCoffeeScript || this.includeScripts) {
      if (this.includeCoffeeScript) {
        this.write('scripts/' + this.projectName + '.coffee', '' + this.projectName + ' = {}\n\n' + this.projectName + '.init = ->\n  console.log \'Hello from ' + this.projectName + '\'\n\n' + this.projectName + '.version = \'@@VERSION\'\n');

      } else {
        this.write('scripts/' + this.projectName + '.js', '\'use strict\';\n\nvar ' + this.projectName + ' = {};\n\n' + this.projectName + '.init = function(){\n  console.log(\'Hello from ' + this.projectName + '\');\n};\n\n' + this.projectName + '.version = \'@@VERSION\';\n')
        this.copy('jshintrc', '.jshintrc');
      }
    }
  },

  styles: function () {
    if (this.includeStyles || this.includeSass) {
      if (this.includeSass) {
        this.write('_' + this.projectName + '.scss', '// Manifest File for ' + this.projectName + '\n\n@import "variables";\n@import "imports";\n');
        this.write('_variables.scss', '// Variables File\n\n$var: #fff;\n');
        this.write('_imports.scss', '// Import File\n\n@import "?";\n');

      } else {
        this.write('' + this.projectName + '.css', '/* Main Styles */\n\n');
      }
    }
  },

  pages: function () {
    if (this.includePages) {
      this.write('pages/' + this.projectName + '.html', '<!-- Start here! -->\n<h1>' + this.projectName + '<small> - @@VERSION</small></h1>\n');
    }
  },

  gruntFile: function () {
    this.template('Gruntfile.coffee', 'Gruntfile.coffee');
  },

  git: function () {
    this.copy('gitignore', '.gitignore');
  }
});

module.exports = MoteGenerator;
