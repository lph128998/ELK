'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapAuthConfig = undefined;

var _lodash = require('lodash');

const wrapAuthConfig = exports.wrapAuthConfig = allowAnonymous => {
  if (allowAnonymous) {
    return options => (0, _lodash.assign)(options, { config: { auth: false } });
  }
  return _lodash.identity;
};