'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectDashboards = collectDashboards;

var _collect_panels = require('./collect_panels');

async function collectDashboards(savedObjectsClient, ids) {

  if (ids.length === 0) return [];

  const objects = ids.map(id => {
    return {
      type: 'dashboard',
      id: id
    };
  });

  const { saved_objects: savedObjects } = await savedObjectsClient.bulkGet(objects);
  const results = await Promise.all(savedObjects.map(d => (0, _collect_panels.collectPanels)(savedObjectsClient, d)));

  return results.reduce((acc, result) => acc.concat(result), []).reduce((acc, obj) => {
    if (!acc.find(o => o.id === obj.id)) acc.push(obj);
    return acc;
  }, []);
}