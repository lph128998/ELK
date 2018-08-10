'use strict';

var _override = require('./override');

var _override2 = _interopRequireDefault(_override);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('override(target, source)', function () {

  it('should override the values form source to target', function () {
    const target = {
      test: {
        enable: true,
        host: ['host-01', 'host-02'],
        client: {
          type: 'sql'
        }
      }
    };
    const source = { test: { client: { type: 'nosql' } } };
    expect((0, _override2.default)(target, source)).toEqual({
      test: {
        enable: true,
        host: ['host-01', 'host-02'],
        client: {
          type: 'nosql'
        }
      }
    });
  });
});