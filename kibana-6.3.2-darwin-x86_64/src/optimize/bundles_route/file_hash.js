'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileHash = getFileHash;

var _crypto = require('crypto');

var _fs = require('fs');

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const $fromEvent = _Rx2.default.Observable.fromEvent;
const $throw = _Rx2.default.Observable.throw;

/**
 *  Get the hash of a file via a file descriptor
 *  @param  {LruCache} cache
 *  @param  {string} path
 *  @param  {Fs.Stat} stat
 *  @param  {Fs.FileDescriptor} fd
 *  @return {Promise<string>}
 */
async function getFileHash(cache, path, stat, fd) {
  const key = `${path}:${stat.ino}:${stat.size}:${stat.mtime.getTime()}`;

  const cached = cache.get(key);
  if (cached) {
    return await cached;
  }

  const hash = (0, _crypto.createHash)('sha1');
  const read = (0, _fs.createReadStream)(null, {
    fd,
    start: 0,
    autoClose: false
  });

  const promise = $fromEvent(read, 'data').merge($fromEvent(read, 'error').mergeMap($throw)).takeUntil($fromEvent(read, 'end')).forEach(chunk => hash.update(chunk)).then(() => hash.digest('hex')).catch(error => {
    // don't cache failed attempts
    cache.del(key);
    throw error;
  });

  cache.set(key, promise);
  return await promise;
}