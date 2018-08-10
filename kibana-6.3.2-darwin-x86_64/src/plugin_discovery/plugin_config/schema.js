'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSchema = getSchema;
exports.getStubSchema = getStubSchema;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const STUB_CONFIG_SCHEMA = _joi2.default.object().keys({
  enabled: _joi2.default.valid(false).default(false)
}).default();

const DEFAULT_CONFIG_SCHEMA = _joi2.default.object().keys({
  enabled: _joi2.default.boolean().default(true)
}).default();

/**
 *  Get the config schema for a plugin spec
 *  @param  {PluginSpec} spec
 *  @return {Promise<Joi>}
 */
async function getSchema(spec) {
  const provider = spec.getConfigSchemaProvider();
  return provider && (await provider(_joi2.default)) || DEFAULT_CONFIG_SCHEMA;
}

function getStubSchema() {
  return STUB_CONFIG_SCHEMA;
}