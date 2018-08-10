'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _mockFs = require('mock-fs');

var _mockFs2 = _interopRequireDefault(_mockFs);

var _keystore = require('../server/keystore');

var _remove = require('./remove');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Kibana keystore', () => {
  describe('remove', () => {
    const sandbox = _sinon2.default.sandbox.create();

    const keystoreData = '1:IxR0geiUTMJp8ueHDkqeUJ0I9eEw4NJPXIJi22UDyfGfJSy4mH' + 'BBuGPkkAix/x/YFfIxo4tiKGdJ2oVTtU8LgKDkVoGdL+z7ylY4n3myatt6osqhI4lzJ9M' + 'Ry21UcAJki2qFUTj4TYuvhta3LId+RM5UX/dJ2468hQ==';

    beforeEach(() => {
      (0, _mockFs2.default)({
        '/data': {
          'test.keystore': JSON.stringify(keystoreData)
        }
      });
    });

    afterEach(() => {
      _mockFs2.default.restore();
      sandbox.restore();
    });

    it('removes key', () => {
      const keystore = new _keystore.Keystore('/data/test.keystore');

      (0, _remove.remove)(keystore, 'a2');

      expect(keystore.data).toEqual({ 'a1.b2.c3': 'foo' });
    });

    it('persists the keystore', () => {
      const keystore = new _keystore.Keystore('/data/test.keystore');
      sandbox.stub(keystore, 'save');

      (0, _remove.remove)(keystore, 'a2');

      _sinon2.default.assert.calledOnce(keystore.save);
    });
  });
});