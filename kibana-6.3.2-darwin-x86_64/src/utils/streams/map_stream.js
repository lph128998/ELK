'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMapStream = createMapStream;

var _stream = require('stream');

function createMapStream(fn) {
  let i = 0;

  return new _stream.Transform({
    objectMode: true,
    async transform(value, enc, done) {
      try {
        this.push((await fn(value, i++)));
        done();
      } catch (err) {
        done(err);
      }
    }
  });
}