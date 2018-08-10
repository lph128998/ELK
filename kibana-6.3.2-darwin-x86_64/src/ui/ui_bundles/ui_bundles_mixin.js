'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiBundlesMixin = uiBundlesMixin;

var _ui_bundles_controller = require('./ui_bundles_controller');

async function uiBundlesMixin(kbnServer) {
  kbnServer.uiBundles = new _ui_bundles_controller.UiBundlesController(kbnServer);

  const { uiBundleProviders = [] } = kbnServer.uiExports;
  for (const spec of uiBundleProviders) {
    await spec(kbnServer);
  }
}