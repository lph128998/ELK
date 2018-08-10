'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importDashboards = importDashboards;

var _lodash = require('lodash');

async function importDashboards(req) {
  const { payload } = req;
  const overwrite = 'force' in req.query && req.query.force !== false;
  const exclude = (0, _lodash.flatten)([req.query.exclude]);

  const savedObjectsClient = req.getSavedObjectsClient();

  const docs = payload.objects.filter(item => !exclude.includes(item.type));

  const objects = await savedObjectsClient.bulkCreate(docs, { overwrite });
  return { objects };
}