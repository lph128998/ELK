'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPackAtPath$ = undefined;

var _rxjs = require('rxjs');

var _path = require('path');

var _errors = require('../errors');

var _lib = require('./lib');

var _plugin_pack = require('./plugin_pack');

async function createPackAtPath(path) {
  if (!(await (0, _lib.isDirectory)(path))) {
    throw (0, _errors.createInvalidPackError)(path, 'must be a directory');
  }

  let pkg;
  try {
    pkg = require((0, _path.resolve)(path, 'package.json'));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw (0, _errors.createInvalidPackError)(path, 'must have a package.json file');
    }
  }

  if (!pkg || typeof pkg !== 'object') {
    throw (0, _errors.createInvalidPackError)(path, 'must have a valid package.json file');
  }

  let provider = require(path);
  if (provider.__esModule) {
    provider = provider.default;
  }
  if (typeof provider !== 'function') {
    throw (0, _errors.createInvalidPackError)(path, 'must export a function');
  }

  return new _plugin_pack.PluginPack({ path, pkg, provider });
}

const createPackAtPath$ = exports.createPackAtPath$ = path => _rxjs.Observable.defer(() => createPackAtPath(path)).map(pack => ({ pack })).catch(error => [{ error }]);