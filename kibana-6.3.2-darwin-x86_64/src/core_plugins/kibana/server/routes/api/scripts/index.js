'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scriptsApi = scriptsApi;

var _register_languages = require('./register_languages');

function scriptsApi(server) {
  (0, _register_languages.registerLanguages)(server);
}