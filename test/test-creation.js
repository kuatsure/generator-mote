/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('mote generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('mote:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected js files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.editorconfig',
      '.jshintrc',
      'bower.json',
      'package.json',
      'Gruntfile.coffee',
      'scripts/moteTest.js',
      '.gitignore'
    ];

    helpers.mockPrompt(this.app, {
      'projectName': 'moteTest',
      features: [
        'includeScripts'
      ]
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

  it('creates expected css files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.editorconfig',
      'bower.json',
      'package.json',
      'moteTest.css',
      '.gitignore'
    ];

    helpers.mockPrompt(this.app, {
      'projectName': 'moteTest',
      features: [
        'includeStyles'
      ]
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

  it('creates expected pages files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.editorconfig',
      'bower.json',
      'package.json',
      'Gruntfile.coffee',
      'pages/moteTest.html',
      '.gitignore'
    ];

    helpers.mockPrompt(this.app, {
      'projectName': 'moteTest',
      features: [
        'includePages'
      ]
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
