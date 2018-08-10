'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiMixin = uiMixin;

var _ui_exports = require('./ui_exports');

var _field_formats = require('./field_formats');

var _tutorials_mixin = require('./tutorials_mixin');

var _ui_apps = require('./ui_apps');

var _ui_i18n = require('./ui_i18n');

var _ui_bundles = require('./ui_bundles');

var _ui_nav_links = require('./ui_nav_links');

var _ui_render = require('./ui_render');

var _ui_settings = require('./ui_settings');

async function uiMixin(kbnServer) {
  await kbnServer.mixin(_ui_exports.uiExportsMixin);
  await kbnServer.mixin(_ui_apps.uiAppsMixin);
  await kbnServer.mixin(_ui_bundles.uiBundlesMixin);
  await kbnServer.mixin(_ui_settings.uiSettingsMixin);
  await kbnServer.mixin(_field_formats.fieldFormatsMixin);
  await kbnServer.mixin(_tutorials_mixin.tutorialsMixin);
  await kbnServer.mixin(_ui_nav_links.uiNavLinksMixin);
  await kbnServer.mixin(_ui_i18n.uiI18nMixin);
  await kbnServer.mixin(_ui_render.uiRenderMixin);
}