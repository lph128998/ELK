'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSettings = getSettings;

var _lodash = require('lodash');

var _config = require('../../server/config');

var serverConfig = _interopRequireWildcard(_config);

var _deprecation = require('../../deprecation');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

async function getDeprecationTransformer(spec) {
  const provider = spec.getDeprecationsProvider() || _lodash.noop;
  return (0, _deprecation.createTransform)((await provider(_deprecation.Deprecations)) || []);
}

/**
 *  Get the settings for a pluginSpec from the raw root settings while
 *  optionally calling logDeprecation() with warnings about deprecated
 *  settings that were used
 *  @param  {PluginSpec} spec
 *  @param  {Object} rootSettings
 *  @param  {Function} [logDeprecation]
 *  @return {Promise<Object>}
 */
async function getSettings(spec, rootSettings, logDeprecation) {
  const prefix = spec.getConfigPrefix();
  const transformer = await getDeprecationTransformer(spec);
  const rawSettings = (0, _lodash.get)(serverConfig.transformDeprecations(rootSettings), prefix);
  return transformer(rawSettings, logDeprecation);
}