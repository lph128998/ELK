'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupLogging = setupLogging;
exports.loggingMixin = loggingMixin;

var _bluebird = require('bluebird');

var _evenBetter = require('even-better');

var _evenBetter2 = _interopRequireDefault(_evenBetter);

var _configuration = require('./configuration');

var _configuration2 = _interopRequireDefault(_configuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupLogging(server, config) {
  return (0, _bluebird.fromNode)(cb => {
    server.register({
      register: _evenBetter2.default,
      options: (0, _configuration2.default)(config)
    }, cb);
  });
}

function loggingMixin(kbnServer, server, config) {
  return setupLogging(server, config);
}