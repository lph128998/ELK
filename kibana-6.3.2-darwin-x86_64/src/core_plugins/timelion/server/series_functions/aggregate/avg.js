'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (points) {
  return _lodash2.default.sum(points) / points.length;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];