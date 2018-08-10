'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiBundle = undefined;

var _bluebird = require('bluebird');

var _fs = require('fs');

// We normalize all path separators to `/` in generated files
function normalizePath(path) {
  return path.replace(/[\\\/]+/g, '/');
}

class UiBundle {
  constructor(options) {
    const {
      id,
      modules,
      template,
      controller
    } = options;

    this._id = id;
    this._modules = modules;
    this._template = template;
    this._controller = controller;
  }

  getId() {
    return this._id;
  }

  getContext() {
    return this._controller.getContext();
  }

  getEntryPath() {
    return this._controller.resolvePath(`${this.getId()}.entry.js`);
  }

  getStylePath() {
    return this._controller.resolvePath(`${this.getId()}.style.css`);
  }

  getOutputPath() {
    return this._controller.resolvePath(`${this.getId()}.bundle.js`);
  }

  getRequires() {
    return this._modules.map(module => `require('${normalizePath(module)}');`);
  }

  renderContent() {
    return this._template(this);
  }

  async readEntryFile() {
    try {
      const content = await (0, _bluebird.fromNode)(cb => (0, _fs.readFile)(this.getEntryPath(), cb));
      return content.toString('utf8');
    } catch (e) {
      return null;
    }
  }

  async writeEntryFile() {
    return await (0, _bluebird.fromNode)(cb => (0, _fs.writeFile)(this.getEntryPath(), this.renderContent(), 'utf8', cb));
  }

  async hasStyleFile() {
    return await (0, _bluebird.fromNode)(cb => {
      return (0, _fs.stat)(this.getStylePath(), error => {
        cb(null, !(error && error.code === 'ENOENT'));
      });
    });
  }

  async touchStyleFile() {
    return await (0, _bluebird.fromNode)(cb => (0, _fs.writeFile)(this.getStylePath(), '', 'utf8', cb));
  }

  async clearBundleFile() {
    try {
      await (0, _bluebird.fromNode)(cb => (0, _fs.unlink)(this.getOutputPath(), cb));
    } catch (e) {
      return null;
    }
  }

  async isCacheValid() {
    try {
      await (0, _bluebird.fromNode)(cb => (0, _fs.stat)(this.getOutputPath(), cb));
      return true;
    } catch (e) {
      return false;
    }
  }

  toJSON() {
    return {
      id: this._id,
      modules: this._modules,
      entryPath: this.getEntryPath(),
      outputPath: this.getOutputPath()
    };
  }
}
exports.UiBundle = UiBundle;