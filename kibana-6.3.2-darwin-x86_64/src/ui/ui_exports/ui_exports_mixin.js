'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiExportsMixin = uiExportsMixin;

var _collect_ui_exports = require('./collect_ui_exports');

function uiExportsMixin(kbnServer) {
  kbnServer.uiExports = (0, _collect_ui_exports.collectUiExports)(kbnServer.pluginSpecs);

  // check for unknown uiExport types
  const { unknown = [] } = kbnServer.uiExports;
  if (!unknown.length) {
    return;
  }

  throw new Error(`Unknown uiExport types: ${unknown.map(({ pluginSpec, type }) => `${type} from ${pluginSpec.getId()}`).join(', ')}`);
}