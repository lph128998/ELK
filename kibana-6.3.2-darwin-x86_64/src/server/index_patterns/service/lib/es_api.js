'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callIndexAliasApi = callIndexAliasApi;
exports.callFieldCapsApi = callFieldCapsApi;

var _errors = require('./errors');

/**
 *  Call the index.getAlias API for a list of indices.
 *
 *  If `indices` is an array or comma-separated list and some of the
 *  values don't match anything but others do this will return the
 *  matches and not throw an error.
 *
 *  If not a single index matches then a NoMatchingIndicesError will
 *  be thrown.
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {Array<String>|String} indices
 *  @return {Promise<IndexAliasResponse>}
 */
async function callIndexAliasApi(callCluster, indices) {
  try {
    return await callCluster('indices.getAlias', {
      index: indices,
      ignoreUnavailable: true,
      allowNoIndices: false
    });
  } catch (error) {
    throw (0, _errors.convertEsError)(indices, error);
  }
}

/**
 *  Call the fieldCaps API for a list of indices.
 *
 *  Just like callIndexAliasApi(), callFieldCapsApi() throws
 *  if no indexes are matched, but will return potentially
 *  "partial" results if even a single index is matched.
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {Array<String>|String} indices
 *  @return {Promise<FieldCapsResponse>}
 */
async function callFieldCapsApi(callCluster, indices) {
  try {
    return await callCluster('fieldCaps', {
      index: indices,
      fields: '*',
      ignoreUnavailable: true,
      allowNoIndices: false
    });
  } catch (error) {
    throw (0, _errors.convertEsError)(indices, error);
  }
}