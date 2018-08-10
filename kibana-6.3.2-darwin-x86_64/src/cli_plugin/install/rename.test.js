'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rename = require('./rename');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('plugin folder rename', function () {
  let renameStub;

  beforeEach(function () {
    renameStub = _sinon2.default.stub();
  });

  afterEach(function () {
    _fs2.default.rename.restore();
  });

  it('should rethrow any exceptions', function () {
    renameStub = _sinon2.default.stub(_fs2.default, 'rename', function (from, to, cb) {
      cb({
        code: 'error'
      });
    });

    return (0, _rename.renamePlugin)('/foo/bar', '/bar/foo').catch(function (err) {
      expect(err.code).toBe('error');
      expect(renameStub.callCount).toBe(1);
    });
  });

  it('should resolve if there are no errors', function () {
    renameStub = _sinon2.default.stub(_fs2.default, 'rename', function (from, to, cb) {
      cb();
    });

    return (0, _rename.renamePlugin)('/foo/bar', '/bar/foo').then(function () {
      expect(renameStub.callCount).toBe(1);
    }).catch(function () {
      throw new Error('We shouln\'t have any errors');
    });
  });

  describe('Windows', function () {
    let platform;
    beforeEach(function () {
      platform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      });
    });
    afterEach(function () {
      Object.defineProperty(process, 'platform', platform);
    });

    it('should retry on Windows EPERM errors for up to 3 seconds', function () {
      renameStub = _sinon2.default.stub(_fs2.default, 'rename', function (from, to, cb) {
        cb({
          code: 'EPERM'
        });
      });
      return (0, _rename.renamePlugin)('/foo/bar', '/bar/foo').catch(function (err) {
        expect(err.code).toBe('EPERM');
        expect(renameStub.callCount).toBeGreaterThan(1);
      });
    }, 5000);
  });
});