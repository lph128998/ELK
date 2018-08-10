'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppBootstrap = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _crypto = require('crypto');

var _fs = require('fs');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppBootstrap {
  constructor({ templateData, translations }) {
    this.templateData = templateData;
    this.translations = translations;
    this._rawTemplate = undefined;
  }

  async getJsFile() {
    if (!this._rawTemplate) {
      this._rawTemplate = await loadRawTemplate();
    }

    _handlebars2.default.registerHelper('i18n', key => _lodash2.default.get(this.translations, key, ''));
    const template = _handlebars2.default.compile(this._rawTemplate, {
      knownHelpers: { i18n: true },
      knownHelpersOnly: true,
      noEscape: true, // this is a js file, so html escaping isn't appropriate
      strict: true
    });
    const compiledJsFile = template(this.templateData);
    _handlebars2.default.unregisterHelper('i18n');

    return compiledJsFile;
  }

  async getJsFileHash() {
    const fileContents = await this.getJsFile();
    const hash = (0, _crypto.createHash)('sha1');
    hash.update(fileContents);
    return hash.digest('hex');
  }
}

exports.AppBootstrap = AppBootstrap;
function loadRawTemplate() {
  const templatePath = (0, _path.resolve)(__dirname, 'template.js.hbs');
  return readFileAsync(templatePath);
}

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    (0, _fs.readFile)(filePath, 'utf8', (err, fileContents) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(fileContents);
    });
  });
}