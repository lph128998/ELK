'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPlugin(name, version, pluginBaseDir) {
  const pluginDir = (0, _path.join)(pluginBaseDir, name);
  _mkdirp2.default.sync(pluginDir);
  (0, _fs.appendFileSync)((0, _path.join)(pluginDir, 'package.json'), '{"version": "' + version + '"}');
}

describe('kibana cli', function () {

  describe('plugin lister', function () {

    const pluginDir = (0, _path.join)(__dirname, '.test.data.list');
    let logger;

    const settings = {
      pluginDir: pluginDir
    };

    beforeEach(function () {
      logger = new _logger2.default(settings);
      _sinon2.default.stub(logger, 'log');
      _sinon2.default.stub(logger, 'error');
      _rimraf2.default.sync(pluginDir);
      _mkdirp2.default.sync(pluginDir);
    });

    afterEach(function () {
      logger.log.restore();
      logger.error.restore();
      _rimraf2.default.sync(pluginDir);
    });

    it('list all of the folders in the plugin folder', function () {
      createPlugin('plugin1', '5.0.0-alpha2', pluginDir);
      createPlugin('plugin2', '3.2.1', pluginDir);
      createPlugin('plugin3', '1.2.3', pluginDir);

      (0, _list2.default)(settings, logger);

      expect(logger.log.calledWith('plugin1@5.0.0-alpha2')).toBe(true);
      expect(logger.log.calledWith('plugin2@3.2.1')).toBe(true);
      expect(logger.log.calledWith('plugin3@1.2.3')).toBe(true);
    });

    it('ignore folders that start with a period', function () {
      createPlugin('.foo', '1.0.0', pluginDir);
      createPlugin('plugin1', '5.0.0-alpha2', pluginDir);
      createPlugin('plugin2', '3.2.1', pluginDir);
      createPlugin('plugin3', '1.2.3', pluginDir);
      createPlugin('.bar', '1.0.0', pluginDir);

      (0, _list2.default)(settings, logger);

      expect(logger.log.calledWith('.foo@1.0.0')).toBe(false);
      expect(logger.log.calledWith('.bar@1.0.0')).toBe(false);
    });

    it('list should only list folders', function () {
      createPlugin('plugin1', '1.0.0', pluginDir);
      createPlugin('plugin2', '1.0.0', pluginDir);
      createPlugin('plugin3', '1.0.0', pluginDir);
      (0, _fs.writeFileSync)((0, _path.join)(pluginDir, 'plugin4'), 'This is a file, and not a folder.');

      (0, _list2.default)(settings, logger);

      expect(logger.log.calledWith('plugin1@1.0.0')).toBe(true);
      expect(logger.log.calledWith('plugin2@1.0.0')).toBe(true);
      expect(logger.log.calledWith('plugin3@1.0.0')).toBe(true);
    });

    it('list should throw an exception if a plugin does not have a package.json', function () {
      createPlugin('plugin1', '1.0.0', pluginDir);
      _mkdirp2.default.sync((0, _path.join)(pluginDir, 'empty-plugin'));

      expect(function () {
        (0, _list2.default)(settings, logger);
      }).toThrowError('Unable to read package.json file for plugin empty-plugin');
    });

    it('list should throw an exception if a plugin have an empty package.json', function () {
      createPlugin('plugin1', '1.0.0', pluginDir);
      const invalidPluginDir = (0, _path.join)(pluginDir, 'invalid-plugin');
      _mkdirp2.default.sync(invalidPluginDir);
      (0, _fs.appendFileSync)((0, _path.join)(invalidPluginDir, 'package.json'), '');

      expect(function () {
        (0, _list2.default)(settings, logger);
      }).toThrowError('Unable to read package.json file for plugin invalid-plugin');
    });
  });
});