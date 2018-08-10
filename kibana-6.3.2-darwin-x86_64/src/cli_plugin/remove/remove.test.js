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

var _remove = require('./remove');

var _remove2 = _interopRequireDefault(_remove);

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('kibana cli', function () {

  describe('plugin remover', function () {

    const pluginDir = (0, _path.join)(__dirname, '.test.data.remove');
    let processExitStub;
    let logger;

    const settings = { pluginDir };

    beforeEach(function () {
      processExitStub = _sinon2.default.stub(process, 'exit');
      logger = new _logger2.default(settings);
      _sinon2.default.stub(logger, 'log');
      _sinon2.default.stub(logger, 'error');
      _rimraf2.default.sync(pluginDir);
      _mkdirp2.default.sync(pluginDir);
    });

    afterEach(function () {
      processExitStub.restore();
      logger.log.restore();
      logger.error.restore();
      _rimraf2.default.sync(pluginDir);
    });

    it('throw an error if the plugin is not installed.', function () {
      settings.pluginPath = (0, _path.join)(pluginDir, 'foo');
      settings.plugin = 'foo';

      (0, _remove2.default)(settings, logger);
      expect(logger.error.firstCall.args[0]).toMatch(/not installed/);
      expect(process.exit.called).toBe(true);
    });

    it('throw an error if the specified plugin is not a folder.', function () {
      (0, _fs.writeFileSync)((0, _path.join)(pluginDir, 'foo'), 'This is a file, and not a folder.');

      (0, _remove2.default)(settings, logger);
      expect(logger.error.firstCall.args[0]).toMatch(/not a plugin/);
      expect(process.exit.called).toBe(true);
    });

    it('remove x-pack if it exists', () => {
      settings.pluginPath = (0, _path.join)(pluginDir, 'x-pack');
      settings.plugin = 'x-pack';
      _mkdirp2.default.sync((0, _path.join)(pluginDir, 'x-pack'));
      expect((0, _fs.existsSync)(settings.pluginPath)).toEqual(true);
      (0, _remove2.default)(settings, logger);
      expect((0, _fs.existsSync)(settings.pluginPath)).toEqual(false);
    });

    it('distribution error if x-pack does not exist', () => {
      settings.pluginPath = (0, _path.join)(pluginDir, 'x-pack');
      settings.plugin = 'x-pack';
      expect((0, _fs.existsSync)(settings.pluginPath)).toEqual(false);
      (0, _remove2.default)(settings, logger);
      expect(logger.error.getCall(0).args[0]).toMatch(/Please install the OSS-only distribution to remove X-Pack features/);
    });

    it('delete the specified folder.', function () {
      settings.pluginPath = (0, _path.join)(pluginDir, 'foo');
      _mkdirp2.default.sync((0, _path.join)(pluginDir, 'foo'));
      _mkdirp2.default.sync((0, _path.join)(pluginDir, 'bar'));

      (0, _remove2.default)(settings, logger);

      const files = _globAll2.default.sync('**/*', { cwd: pluginDir });
      const expected = ['bar'];
      expect(files.sort()).toEqual(expected.sort());
    });
  });
});