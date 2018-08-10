'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatIfUniq = undefined;
exports.getFieldCapabilities = getFieldCapabilities;

var _lodash = require('lodash');

var _es_api = require('../es_api');

var _field_caps_response = require('./field_caps_response');

var _overrides = require('./overrides');

const concatIfUniq = exports.concatIfUniq = (arr, value) => arr.includes(value) ? arr : arr.concat(value);

/**
 *  Get the field capabilities for field in `indices`, excluding
 *  all internal/underscore-prefixed fields that are not in `metaFields`
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {Array}  [indices=[]]  the list of indexes to check
 *  @param  {Array}  [metaFields=[]] the list of internal fields to include
 *  @return {Promise<Array<FieldInfo>>}
 */
async function getFieldCapabilities(callCluster, indices = [], metaFields = []) {
  const esFieldCaps = await (0, _es_api.callFieldCapsApi)(callCluster, indices);
  const fieldsFromFieldCapsByName = (0, _lodash.indexBy)((0, _field_caps_response.readFieldCapsResponse)(esFieldCaps), 'name');

  const allFieldsUnsorted = Object.keys(fieldsFromFieldCapsByName).filter(name => !name.startsWith('_')).concat(metaFields).reduce(concatIfUniq, []).map(name => (0, _lodash.defaults)({}, fieldsFromFieldCapsByName[name], {
    name,
    type: 'string',
    searchable: false,
    aggregatable: false,
    readFromDocValues: false
  })).map(_overrides.mergeOverrides);

  return (0, _lodash.sortBy)(allFieldsUnsorted, 'name');
}