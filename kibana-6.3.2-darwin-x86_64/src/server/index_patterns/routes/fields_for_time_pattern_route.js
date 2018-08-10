'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFieldsForTimePatternRoute = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createFieldsForTimePatternRoute = exports.createFieldsForTimePatternRoute = pre => ({
  path: '/api/index_patterns/_fields_for_time_pattern',
  method: 'GET',
  config: {
    pre: [pre.getIndexPatternsService],
    validate: {
      query: _joi2.default.object().keys({
        pattern: _joi2.default.string().required(),
        look_back: _joi2.default.number().min(1).required(),
        meta_fields: _joi2.default.array().items(_joi2.default.string()).default([])
      }).default()
    },
    handler(req, reply) {
      const { indexPatterns } = req.pre;
      const {
        pattern,
        interval,
        look_back: lookBack,
        meta_fields: metaFields
      } = req.query;

      reply(indexPatterns.getFieldsForTimePattern({
        pattern,
        interval,
        lookBack,
        metaFields
      }).then(fields => ({ fields })));
    }
  }
});