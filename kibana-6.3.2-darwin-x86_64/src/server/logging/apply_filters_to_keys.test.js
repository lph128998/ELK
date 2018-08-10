'use strict';

var _apply_filters_to_keys = require('./apply_filters_to_keys');

var _apply_filters_to_keys2 = _interopRequireDefault(_apply_filters_to_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('applyFiltersToKeys(obj, actionsByKey)', function () {
  it('applies for each key+prop in actionsByKey', function () {
    const data = (0, _apply_filters_to_keys2.default)({
      a: {
        b: {
          c: 1
        },
        d: {
          e: 'foobar'
        }
      },
      req: {
        headers: {
          authorization: 'Basic dskd939k2i'
        }
      }
    }, {
      b: 'remove',
      e: 'censor',
      authorization: '/([^\\s]+)$/'
    });

    expect(data).toEqual({
      a: {
        d: {
          e: 'XXXXXX'
        }
      },
      req: {
        headers: {
          authorization: 'Basic XXXXXXXXXX'
        }
      }
    });
  });
});