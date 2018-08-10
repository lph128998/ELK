'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFields = getFields;

var _lodash = require('lodash');

async function getFields(req) {
  const { indexPatternsService } = req.pre;
  const index = req.query.index || '*';
  const resp = await indexPatternsService.getFieldsForWildcard({ pattern: index });
  const fields = resp.filter(field => field.aggregatable);
  return (0, _lodash.uniq)(fields, field => field.name);
}