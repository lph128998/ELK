'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _short_url_error = require('./short_url_error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createErrorWithStatus(status) {
  const error = new Error();
  error.status = status;
  return error;
}

function createErrorWithStatusCode(statusCode) {
  const error = new Error();
  error.statusCode = statusCode;
  return error;
}

describe('handleShortUrlError()', () => {
  const caughtErrorsWithStatus = [createErrorWithStatus(401), createErrorWithStatus(403), createErrorWithStatus(404)];

  const caughtErrorsWithStatusCode = [createErrorWithStatusCode(401), createErrorWithStatusCode(403), createErrorWithStatusCode(404)];

  const uncaughtErrors = [new Error(), createErrorWithStatus(500), createErrorWithStatusCode(500)];

  caughtErrorsWithStatus.forEach(err => {
    it(`should handle errors with status of ${err.status}`, function () {
      expect(_lodash2.default.get((0, _short_url_error.handleShortUrlError)(err), 'output.statusCode')).toBe(err.status);
    });
  });

  caughtErrorsWithStatusCode.forEach(err => {
    it(`should handle errors with statusCode of ${err.statusCode}`, function () {
      expect(_lodash2.default.get((0, _short_url_error.handleShortUrlError)(err), 'output.statusCode')).toBe(err.statusCode);
    });
  });

  uncaughtErrors.forEach(err => {
    it(`should not handle unknown errors`, function () {
      expect(_lodash2.default.get((0, _short_url_error.handleShortUrlError)(err), 'output.statusCode')).toBe(500);
    });
  });
});