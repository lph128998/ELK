'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldFormatsMixin = fieldFormatsMixin;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _field_formats_service = require('./field_formats_service');

var _field_format = require('./field_format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fieldFormatsMixin(kbnServer, server) {
  const fieldFormatClasses = [];

  // for use outside of the request context, for special cases
  server.decorate('server', 'fieldFormatServiceFactory', async function (uiSettings) {
    const uiConfigs = await uiSettings.getAll();
    const uiSettingDefaults = await uiSettings.getDefaults();
    Object.keys(uiSettingDefaults).forEach(key => {
      if (_lodash2.default.has(uiConfigs, key) && uiSettingDefaults[key].type === 'json') {
        uiConfigs[key] = JSON.parse(uiConfigs[key]);
      }
    });
    const getConfig = key => uiConfigs[key];
    return new _field_formats_service.FieldFormatsService(fieldFormatClasses, getConfig);
  });

  server.decorate('server', 'registerFieldFormat', createFormat => {
    fieldFormatClasses.push(createFormat(_field_format.FieldFormat));
  });
}