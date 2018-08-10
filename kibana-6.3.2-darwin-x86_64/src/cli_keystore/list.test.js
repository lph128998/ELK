'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _mockFs = require('mock-fs');

var _mockFs2 = _interopRequireDefault(_mockFs);

var _keystore = require('../server/keystore');

var _list = require('./list');

var _logger = require('../cli_plugin/lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Kibana keystore', () => {
  describe('list', () => {
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

    it('outputs keys', () => {
      const keystore = new _keystore.Keystore('/data/test.keystore');
      (0, _list.list)(keystore);

      _sinon2.default.assert.calledOnce(_logger2.default.prototype.log);
      _sinon2.default.assert.calledWith(_logger2.default.prototype.log, 'a1.b2.c3\na2');
    });

    it('handles a nonexistent keystore', () => {
      const keystore = new _keystore.Keystore('/data/nonexistent.keystore');
      (0, _list.list)(keystore);

      _sinon2.default.assert.calledOnce(_logger2.default.prototype.error);
      _sinon2.default.assert.calledWith(_logger2.default.prototype.error, 'ERROR: Kibana keystore not found. Use \'create\' command to create one.');
    });
  });
});