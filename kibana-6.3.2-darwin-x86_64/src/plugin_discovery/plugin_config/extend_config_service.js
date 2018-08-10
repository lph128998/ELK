'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendConfigService = extendConfigService;
exports.disableConfigExtension = disableConfigExtension;

var _settings = require('./settings');

var _schema = require('./schema');

/**
 *  Extend a config service with the schema and settings for a
 *  plugin spec and optionally call logDeprecation with warning
 *  messages about deprecated settings that are used
 *  @param  {PluginSpec} spec
 *  @param  {Server.Config} config
 *  @param  {Object} rootSettings
 *  @param  {Function} [logDeprecation]
 *  @return {Promise<undefined>}
 */
async function extendConfigService(spec, config, rootSettings, logDeprecation) {
  const settings = await (0, _settings.getSettings)(spec, rootSettings, logDeprecation);
  const schema = await (0, _schema.getSchema)(spec);
  config.extendSchema(schema, settings, spec.getConfigPrefix());
}

/**
 *  Disable the schema and settings applied to a config service for
 *  a plugin spec
 *  @param  {PluginSpec} spec
 *  @param  {Server.Config} config
 *  @return {undefined}
 */
function disableConfigExtension(spec, config) {
  const prefix = spec.getConfigPrefix();
  config.removeSchema(prefix);
  config.extendSchema((0, _schema.getStubSchema)(), { enabled: false }, prefix);
}