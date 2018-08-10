'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getTableData = getTableData;

var _build_request_body = require('./table/build_request_body');

var _build_request_body2 = _interopRequireDefault(_build_request_body);

var _handle_error_response = require('./handle_error_response');

var _handle_error_response2 = _interopRequireDefault(_handle_error_response);

var _lodash = require('lodash');

var _process_bucket = require('./table/process_bucket');

var _process_bucket2 = _interopRequireDefault(_process_bucket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getTableData(req, panel) {
  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('data');
  const params = {
    index: panel.index_pattern,
    body: (0, _build_request_body2.default)(req, panel)
  };
  try {
    const resp = await callWithRequest(req, 'search', params);
    const buckets = (0, _lodash.get)(resp, 'aggregations.pivot.buckets', []);
    return { type: 'table', series: buckets.map((0, _process_bucket2.default)(panel)) };
  } catch (err) {
    if (err.body) {
      err.response = err.body;
      return _extends({ type: 'table' }, (0, _handle_error_response2.default)(panel)(err));
    }
  }
}