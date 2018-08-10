'use strict';

var _explode_by = require('./explode_by');

var _explode_by2 = _interopRequireDefault(_explode_by);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('explode_by(dot, flatObject)', function () {

  it('should explode a flatten object with dots', function () {
    const flatObject = {
      'test.enable': true,
      'test.hosts': ['host-01', 'host-02']
    };
    expect((0, _explode_by2.default)('.', flatObject)).toEqual({
      test: {
        enable: true,
        hosts: ['host-01', 'host-02']
      }
    });
  });

  it('should explode a flatten object with slashes', function () {
    const flatObject = {
      'test/enable': true,
      'test/hosts': ['host-01', 'host-02']
    };
    expect((0, _explode_by2.default)('/', flatObject)).toEqual({
      test: {
        enable: true,
        hosts: ['host-01', 'host-02']
      }
    });
  });
});