'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _std_metric = require('./std_metric');

var _std_metric2 = _interopRequireDefault(_std_metric);

var _std_sibling = require('./std_sibling');

var _std_sibling2 = _interopRequireDefault(_std_sibling);

var _series_agg = require('./series_agg');

var _series_agg2 = _interopRequireDefault(_series_agg);

var _math = require('./math');

var _drop_last_bucket = require('./drop_last_bucket');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [
// percentile,
_std_metric2.default, _std_sibling2.default, _math.math, _series_agg2.default, _drop_last_bucket.dropLastBucketFn]; // import percentile from './percentile';

module.exports = exports['default'];