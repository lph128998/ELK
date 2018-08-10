'use strict';

var _utils = require('../../utils');

var _settings = require('./settings');

describe('kibana cli', function () {

  describe('plugin installer', function () {

    describe('command line option parsing', function () {

      describe('parse function', function () {

        const command = 'plugin name';
        let options = {};
        const kbnPackage = { version: 1234 };
        beforeEach(function () {
          options = { pluginDir: (0, _utils.fromRoot)('plugins') };
        });

        describe('quiet option', function () {

          it('should default to false', function () {
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.quiet).toBe(false);
          });

          it('should set settings.quiet property to true', function () {
            options.quiet = true;
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.quiet).toBe(true);
          });
        });

        describe('silent option', function () {

          it('should default to false', function () {
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.silent).toBe(false);
          });

          it('should set settings.silent property to true', function () {
            options.silent = true;
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.silent).toBe(true);
          });
        });

        describe('config option', function () {

          it('should default to ZLS', function () {
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.config).toBe('');
          });

          it('should set settings.config property', function () {
            options.config = 'foo bar baz';
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.config).toBe('foo bar baz');
          });
        });

        describe('pluginDir option', function () {

          it('should default to plugins', function () {
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.pluginDir).toBe((0, _utils.fromRoot)('plugins'));
          });

          it('should set settings.config property', function () {
            options.pluginDir = 'foo bar baz';
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.pluginDir).toBe('foo bar baz');
          });
        });

        describe('command value', function () {

          it('should set settings.plugin property', function () {
            const settings = (0, _settings.parse)(command, options, kbnPackage);

            expect(settings.plugin).toBe(command);
          });
        });
      });
    });
  });
});