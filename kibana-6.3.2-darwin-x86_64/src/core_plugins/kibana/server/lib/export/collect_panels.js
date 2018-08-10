'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectPanels = collectPanels;

var _lodash = require('lodash');

var _collect_index_patterns = require('./collect_index_patterns');

var _collect_search_sources = require('./collect_search_sources');

async function collectPanels(savedObjectsClient, dashboard) {
  let panels;
  try {
    panels = JSON.parse((0, _lodash.get)(dashboard, 'attributes.panelsJSON', '[]'));
  } catch (err) {
    panels = [];
  }

  if (panels.length === 0) return [].concat([dashboard]);

  const { saved_objects: savedObjects } = await savedObjectsClient.bulkGet(panels);
  const [indexPatterns, searchSources] = await Promise.all([(0, _collect_index_patterns.collectIndexPatterns)(savedObjectsClient, savedObjects), (0, _collect_search_sources.collectSearchSources)(savedObjectsClient, savedObjects)]);

  return savedObjects.concat(indexPatterns).concat(searchSources).concat([dashboard]);
}