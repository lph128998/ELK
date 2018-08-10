'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportDashboards = exportDashboards;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _collect_dashboards = require('./collect_dashboards');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function exportDashboards(req) {
  const ids = _lodash2.default.flatten([req.query.dashboard]);
  const config = req.server.config();

  const savedObjectsClient = req.getSavedObjectsClient();

  const objects = await (0, _collect_dashboards.collectDashboards)(savedObjectsClient, ids);
  return {
    version: config.get('pkg.version'),
    objects
  };
}