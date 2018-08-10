'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _mockFs = require('mock-fs');

var _mockFs2 = _interopRequireDefault(_mockFs);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _path = require('path');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _kibana = require('./kibana');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('kibana cli', function () {

  describe('plugin installer', function () {

    describe('kibana', function () {
      const testWorkingPath = (0, _path.join)(__dirname, '.test.data.kibana');
      const tempArchiveFilePath = (0, _path.join)(testWorkingPath, 'archive.part');
      const pluginDir = (0, _path.join)(__dirname, 'plugins');

      const settings = {
        workingPath: testWorkingPath,
        tempArchiveFile: tempArchiveFilePath,
        plugin: 'test-plugin',
        version: '1.0.0',
        plugins: [{ name: 'foo' }],
        pluginDir
      };

      const logger = new _logger2.default(settings);

      describe('assertVersion', function () {

        beforeEach(function () {
          _rimraf2.default.sync(testWorkingPath);
          _mkdirp2.default.sync(testWorkingPath);
          _sinon2.default.stub(logger, 'log');
          _sinon2.default.stub(logger, 'error');
        });

        afterEach(function () {
          logger.log.restore();
          logger.error.restore();
          _rimraf2.default.sync(testWorkingPath);
        });

        it('should succeed with exact match', function () {
          const settings = {
            workingPath: testWorkingPath,
            tempArchiveFile: tempArchiveFilePath,
            plugin: 'test-plugin',
            version: '5.0.0-SNAPSHOT',
            plugins: [{ name: 'foo', path: (0, _path.join)(testWorkingPath, 'foo'), kibanaVersion: '5.0.0-SNAPSHOT' }]
          };

          expect(() => (0, _kibana.assertVersion)(settings)).not.toThrow();
        });

        it('should throw an error if plugin is missing a kibana version.', function () {
          expect(() => (0, _kibana.assertVersion)(settings)).toThrow(/plugin package\.json is missing both a version property/i);
        });

        it('should throw an error if plugin kibanaVersion does not match kibana version', function () {
          settings.plugins[0].kibanaVersion = '1.2.3.4';

          expect(() => (0, _kibana.assertVersion)(settings)).toThrow(/incorrect kibana version/i);
        });

        it('should not throw an error if plugin kibanaVersion matches kibana version', function () {
          settings.plugins[0].kibanaVersion = '1.0.0';

          expect(() => (0, _kibana.assertVersion)(settings)).not.toThrow();
        });

        it('should ignore version info after the dash in checks on valid version', function () {
          settings.plugins[0].kibanaVersion = '1.0.0-foo-bar-version-1.2.3';

          expect(() => (0, _kibana.assertVersion)(settings)).not.toThrow();
        });

        it('should ignore version info after the dash in checks on invalid version', function () {
          settings.plugins[0].kibanaVersion = '2.0.0-foo-bar-version-1.2.3';

          expect(() => (0, _kibana.assertVersion)(settings)).toThrow(/incorrect kibana version/i);
        });
      });

      describe('existingInstall', function () {
        let processExitStub;

        beforeEach(function () {
          processExitStub = _sinon2.default.stub(process, 'exit');
          _sinon2.default.stub(logger, 'log');
          _sinon2.default.stub(logger, 'error');
        });

        afterEach(function () {
          processExitStub.restore();
          logger.log.restore();
          logger.error.restore();
        });

        it('should throw an error if the plugin already exists.', function () {
          (0, _mockFs2.default)({ [`${pluginDir}/foo`]: {} });

          (0, _kibana.existingInstall)(settings, logger);
          expect(logger.error.firstCall.args[0]).toMatch(/already exists/);
          expect(process.exit.called).toBe(true);

          _mockFs2.default.restore();
        });

        it('should not throw an error if the plugin does not exist.', function () {
          (0, _kibana.existingInstall)(settings, logger);
          expect(logger.error.called).toBe(false);
        });
      });
    });
  });
});