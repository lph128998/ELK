'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchStdioForLine = watchStdioForLine;

var _stream = require('stream');

var _streams = require('./streams');

// creates a stream that skips empty lines unless they are followed by
// another line, preventing the empty lines produced by splitStream
function skipLastEmptyLineStream() {
  let skippedEmptyLine = false;
  return new _stream.Transform({
    objectMode: true,
    transform(line, enc, cb) {
      if (skippedEmptyLine) {
        this.push('');
        skippedEmptyLine = false;
      }

      if (line === '') {
        skippedEmptyLine = true;
        return cb();
      } else {
        return cb(null, line);
      }
    }
  });
}

async function watchStdioForLine(proc, logFn, exitAfter) {
  function onLogLine(line) {
    logFn(line);

    if (exitAfter && exitAfter.test(line)) {
      proc.kill('SIGINT');
    }
  }

  await Promise.all([proc.catch(error => {
    // ignore the error thrown by execa if it's because we killed with SIGINT
    if (error.signal !== 'SIGINT') {
      throw error;
    }
  }), (0, _streams.createPromiseFromStreams)([proc.stdout, (0, _streams.createSplitStream)('\n'), skipLastEmptyLineStream(), (0, _streams.createMapStream)(onLogLine)]), (0, _streams.createPromiseFromStreams)([proc.stderr, (0, _streams.createSplitStream)('\n'), skipLastEmptyLineStream(), (0, _streams.createMapStream)(onLogLine)])]);
}