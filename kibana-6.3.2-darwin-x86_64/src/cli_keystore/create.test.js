'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _mockFs = require('mock-fs');

var _mockFs2 = _interopRequireDefault(_mockFs);

var _keystore = require('../server/keystore');

var _create = require('./create');

var _logger = require('../cli_plugin/lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _prompt = require('../server/utils/prompt');

var prompt = _interopRequireWildcard(_prompt);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Kibana keystore', () => {
  describe('create', () => {
    const sandbox = _sinon2.default.sandbox.create();

    const keystoreData = '1:IxR0geiUTMJp8ueHDkqeUJ0I9eEw4NJPXIJi22UDyfGfJSy4mH' + 'BBuGPkkAix/x/YFfIxo4tiKGdJ2oVTtU8LgKDkVoGdL+z7ylY4n3myatt6osqhI4lzJ9M' + 'Ry21UcAJki2qFUTj4TYuvhta3LId+RM5UX/dJ2468hQ==';

    beforeEach(() => {
      (0, _mockFs2.default)({
        '/data': {
          'test.keystore': JSON.stringify(keystoreData)
        }
      });

      sandbox.stub(_logger2.default.prototype, 'log');
      sandbox.stub(_logger2.default.prototype, 'error');
    });

    afterEach(() => {
      _mockFs2.default.restore();
      sandbox.restore();
    });

    it('creates keystore file', async () => {
      const keystore = new _keystore.Keystore('/data/foo.keystore');
      sandbox.stub(keystore, 'save');

      await (0, _create.create)(keystore);

      _sinon2.default.assert.calledOnce(keystore.save);
    });

    it('logs successful keystore creating', async () => {
      const path = '/data/foo.keystore';
      const keystore = new _keystore.Keystore(path);

      await (0, _create.create)(keystore);

      _sinon2.default.assert.calledOnce(_logger2.default.prototype.log);
      _sinon2.default.assert.calledWith(_logger2.default.prototype.log, `Created Kibana keystore in ${path}`);
    });

    it('prompts for overwrite', async () => {
      sandbox.stub(prompt, 'confirm').returns(Promise.resolve(true));

      const keystore = new _keystore.Keystore('/data/test.keystore');
      await (0, _create.create)(keystore);

      _sinon2.default.assert.calledOnce(prompt.confirm);
      const { args } = prompt.confirm.getCall(0);

      expect(args[0]).toEqual('A Kibana keystore already exists. Overwrite?');
    });

    it('aborts if overwrite is denied', async () => {
      sandbox.stub(prompt, 'confirm').returns(Promise.resolve(false));

      const keystore = new _keystore.Keystore('/data/test.keystore');
      sandbox.stub(keystore, 'save');

      await (0, _create.create)(keystore);

      _sinon2.default.assert.calledOnce(_logger2.default.prototype.log);
      _sinon2.default.assert.calledWith(_logger2.default.prototype.log, 'Exiting without modifying keystore.');

      _sinon2.default.assert.notCalled(keystore.save);
    });
  });
});