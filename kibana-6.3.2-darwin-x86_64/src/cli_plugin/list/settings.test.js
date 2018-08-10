'use strict';

var _utils = require('../../utils');

var _settings = require('./settings');

describe('kibana cli', function () {

  describe('plugin installer', function () {

    describe('command line option parsing', function () {

      describe('parse function', function () {

        let command;
        const options = {};
        beforeEach(function () {
          command = { pluginDir: (0, _utils.fromRoot)('plugins') };
        });

        describe('pluginDir option', function () {

          it('should default to plugins', function () {
            const settings = (0, _settings.parse)(command, options);

            expect(settings.pluginDir).toBe((0, _utils.fromRoot)('plugins'));
          });

          it('should set settings.config property', function () {
            command.pluginDir = 'foo bar baz';
            const settings = (0, _settings.parse)(command, options);

            expect(settings.pluginDir).toBe('foo bar baz');
          });
        });
      });
    });
  });
});