'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dateHistogram;

var _lodash = require('lodash');

var _get_bucket_size = require('../../helpers/get_bucket_size');

var _get_bucket_size2 = _interopRequireDefault(_get_bucket_size);

var _get_interval_and_timefield = require('../../get_interval_and_timefield');

var _get_interval_and_timefield2 = _interopRequireDefault(_get_interval_and_timefield);

var _get_timerange = require('../../helpers/get_timerange');

var _get_timerange2 = _interopRequireDefault(_get_timerange);

var _calculate_agg_root = require('./calculate_agg_root');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dateHistogram(req, panel) {
  return next => doc => {
    const { timeField, interval } = (0, _get_interval_and_timefield2.default)(panel);
    const { bucketSize, intervalString } = (0, _get_bucket_size2.default)(req, interval);
    const { from, to } = (0, _get_timerange2.default)(req);
    panel.series.forEach(column => {
      const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column);
      (0, _lodash.set)(doc, `${aggRoot}.timeseries.date_histogram`, {
        field: timeField,
        interval: intervalString,
        min_doc_count: 0,
        extended_bounds: {
          min: from.valueOf(),
          max: to.valueOf()
        }
      });
      (0, _lodash.set)(doc, aggRoot.replace(/\.aggs$/, '.meta'), {
        timeField,
        intervalString,
        bucketSize
      });
    });
    return next(doc);
  };
}
module.exports = exports['default'];