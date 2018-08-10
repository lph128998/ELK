'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.math = math;

var _math = require('../series/math');

function math(bucket, panel, series) {
  return next => results => {
    const mathFn = (0, _math.mathAgg)({ aggregations: bucket }, panel, series);
    return mathFn(next)(results);
  };
}