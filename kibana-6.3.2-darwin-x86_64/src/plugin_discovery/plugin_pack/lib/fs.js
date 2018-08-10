'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChildDirectory$ = undefined;
exports.isDirectory = isDirectory;

var _fs = require('fs');

var _path = require('path');

var _bluebird = require('bluebird');

var _rxjs = require('rxjs');

var _errors = require('../../errors');

function assertAbsolutePath(path) {
  if (typeof path !== 'string') {
    throw (0, _errors.createInvalidDirectoryError)(new TypeError('path must be a string'), path);
  }

  if (!(0, _path.isAbsolute)(path)) {
    throw (0, _errors.createInvalidDirectoryError)(new TypeError('path must be absolute'), path);
  }
}

async function statTest(path, test) {
  try {
    const stats = await (0, _bluebird.fromNode)(cb => (0, _fs.stat)(path, cb));
    return Boolean(test(stats));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  return false;
}

/**
 *  Determine if a path currently points to a directory
 *  @param  {String} path
 *  @return {Promise<boolean>}
 */
async function isDirectory(path) {
  assertAbsolutePath(path);
  return await statTest(path, stat => stat.isDirectory());
}

/**
 *  Get absolute paths for child directories within a path
 *  @param  {string} path
 *  @return {Promise<Array<string>>}
 */
const createChildDirectory$ = exports.createChildDirectory$ = path => _rxjs.Observable.defer(() => {
  assertAbsolutePath(path);
  return (0, _bluebird.fromNode)(cb => (0, _fs.readdir)(path, cb));
}).catch(error => {
  throw (0, _errors.createInvalidDirectoryError)(error, path);
}).mergeAll().filter(name => !name.startsWith('.')).map(name => (0, _path.resolve)(path, name)).mergeMap(v => _rxjs.Observable.fromPromise(isDirectory(path)).mergeMap(pass => pass ? [v] : []));