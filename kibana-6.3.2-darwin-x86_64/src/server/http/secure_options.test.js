'use strict';

var _secure_options = require('./secure_options');

var _secure_options2 = _interopRequireDefault(_secure_options);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const constants = _crypto2.default.constants;

describe('secure_options', function () {
  it('allows null', function () {
    expect((0, _secure_options2.default)(null)).toBe(null);
  });

  it('allows an empty array', function () {
    expect((0, _secure_options2.default)([])).toBe(null);
  });

  it('removes TLSv1 if we only support TLSv1.1 and TLSv1.2', function () {
    expect((0, _secure_options2.default)(['TLSv1.1', 'TLSv1.2'])).toBe(constants.SSL_OP_NO_TLSv1);
  });

  it('removes TLSv1.1 and TLSv1.2 if we only support TLSv1', function () {
    expect((0, _secure_options2.default)(['TLSv1'])).toBe(constants.SSL_OP_NO_TLSv1_1 | constants.SSL_OP_NO_TLSv1_2);
  });

  it('removes TLSv1 and TLSv1.1 if we only support TLSv1.2', function () {
    expect((0, _secure_options2.default)(['TLSv1.2'])).toBe(constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1);
  });
});