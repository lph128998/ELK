'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _globAll = require('glob-all');

var _globAll2 = _interopRequireDefault(_globAll);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _pack = require('./pack');

var _download = require('./download');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('kibana cli', function () {

  describe('pack', function () {

    let testNum = 0;
    const workingPathRoot = (0, _path.join)(__dirname, '.test.data.pack');
    let testWorkingPath;
    let tempArchiveFilePath;
    let testPluginPath;
    let logger;
    let settings;

    beforeEach(function () {
      //These tests are dependent on the file system, and I had some inconsistent
      //behavior with rimraf.sync show up. Until these tests are re-written to not
      //depend on the file system, I make sure that each test uses a different
      //working directory.
      testNum += 1;
      testWorkingPath = (0, _path.join)(workingPathRoot, testNum + '');
      tempArchiveFilePath = (0, _path.join)(testWorkingPath, 'archive.part');
      testPluginPath = (0, _path.join)(testWorkingPath, '.installedPlugins');

      settings = {
        workingPath: testWorkingPath,
        tempArchiveFile: tempArchiveFilePath,
        pluginDir: testPluginPath,
        plugin: 'test-plugin'
      };

      logger = new _logger2.default(settings);
      _sinon2.default.stub(logger, 'log');
      _sinon2.default.stub(logger, 'error');
      _mkdirp2.default.sync(testWorkingPath);
    });

    afterEach(function () {
      logger.log.restore();
      logger.error.restore();
      _rimraf2.default.sync(workingPathRoot);
    });

    function copyReplyFile(filename) {
      const filePath = (0, _path.join)(__dirname, '__fixtures__', 'replies', filename);
      const sourceUrl = 'file://' + filePath.replace(/\\/g, '/');

      return (0, _download._downloadSingle)(settings, logger, sourceUrl);
    }

    function shouldReject() {
      throw new Error('expected the promise to reject');
    }

    describe('extract', function () {

      //Also only extracts the content from the kibana folder.
      //Ignores the others.
      it('successfully extract a valid zip', function () {
        return copyReplyFile('test_plugin.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(() => {
          return (0, _pack.extract)(settings, logger);
        }).then(() => {
          const files = _globAll2.default.sync('**/*', { cwd: testWorkingPath });
          const expected = ['archive.part', 'README.md', 'index.js', 'package.json', 'public', 'public/app.js', 'extra file only in zip.txt'];
          expect(files.sort()).toEqual(expected.sort());
        });
      });
    });

    describe('getPackData', function () {

      it('populate settings.plugins', function () {
        return copyReplyFile('test_plugin.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(() => {
          expect(settings.plugins[0].name).toBe('test-plugin');
          expect(settings.plugins[0].archivePath).toBe('kibana/test-plugin');
          expect(settings.plugins[0].version).toBe('1.0.0');
          expect(settings.plugins[0].kibanaVersion).toBe('1.0.0');
        });
      });

      it('populate settings.plugin.kibanaVersion', function () {
        //kibana.version is defined in this package.json and is different than plugin version
        return copyReplyFile('test_plugin_different_version.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(() => {
          expect(settings.plugins[0].kibanaVersion).toBe('5.0.1');
        });
      });

      it('populate settings.plugin.kibanaVersion (default to plugin version)', function () {
        //kibana.version is not defined in this package.json, defaults to plugin version
        return copyReplyFile('test_plugin.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(() => {
          expect(settings.plugins[0].kibanaVersion).toBe('1.0.0');
        });
      });

      it('populate settings.plugins with multiple plugins', function () {
        return copyReplyFile('test_plugin_many.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(() => {
          expect(settings.plugins[0].name).toBe('funger-plugin');
          expect(settings.plugins[0].archivePath).toBe('kibana/funger-plugin');
          expect(settings.plugins[0].version).toBe('1.0.0');

          expect(settings.plugins[1].name).toBe('pdf');
          expect(settings.plugins[1].archivePath).toBe('kibana/pdf-linux');
          expect(settings.plugins[1].version).toBe('1.0.0');

          expect(settings.plugins[2].name).toBe('pdf');
          expect(settings.plugins[2].archivePath).toBe('kibana/pdf-win32');
          expect(settings.plugins[2].version).toBe('1.0.0');

          expect(settings.plugins[3].name).toBe('pdf');
          expect(settings.plugins[3].archivePath).toBe('kibana/pdf-win64');
          expect(settings.plugins[3].version).toBe('1.0.0');

          expect(settings.plugins[4].name).toBe('pdf');
          expect(settings.plugins[4].archivePath).toBe('kibana/pdf');
          expect(settings.plugins[4].version).toBe('1.0.0');

          expect(settings.plugins[5].name).toBe('test-plugin');
          expect(settings.plugins[5].archivePath).toBe('kibana/test-plugin');
          expect(settings.plugins[5].version).toBe('1.0.0');
        });
      });

      it('throw an error if there is no kibana plugin', function () {
        return copyReplyFile('test_plugin_no_kibana.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(shouldReject, err => {
          expect(err.message).toMatch(/No kibana plugins found in archive/i);
        });
      });

      it('throw an error with a corrupt zip', function () {
        return copyReplyFile('corrupt.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(shouldReject, err => {
          expect(err.message).toMatch(/error retrieving/i);
        });
      });

      it('throw an error if there an invalid plugin name', function () {
        return copyReplyFile('invalid_name.zip').then(() => {
          return (0, _pack.getPackData)(settings, logger);
        }).then(shouldReject, err => {
          expect(err.message).toMatch(/invalid plugin name/i);
        });
      });
    });
  });
});