'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _progress = require('../progress');

var _progress2 = _interopRequireDefault(_progress);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function openSourceFile({ sourcePath }) {
  try {
    const fileInfo = (0, _fs.statSync)(sourcePath);

    const readStream = (0, _fs.createReadStream)(sourcePath);

    return { readStream, fileInfo };
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('ENOTFOUND');
    }

    throw err;
  }
}

async function copyFile({ readStream, writeStream, progress }) {
  await new Promise((resolve, reject) => {
    // if either stream errors, fail quickly
    readStream.on('error', reject);
    writeStream.on('error', reject);

    // report progress as we transfer
    readStream.on('data', chunk => {
      progress.progress(chunk.length);
    });

    // write the download to the file system
    readStream.pipe(writeStream);

    // when the write is done, we are done
    writeStream.on('finish', resolve);
  });
}

/*
// Responsible for managing local file transfers
*/

exports.default = async function copyLocalFile(logger, sourcePath, targetPath) {
  try {
    const { readStream, fileInfo } = openSourceFile({ sourcePath });
    const writeStream = (0, _fs.createWriteStream)(targetPath);

    try {
      const progress = new _progress2.default(logger);
      progress.init(fileInfo.size);

      await copyFile({ readStream, writeStream, progress });

      progress.complete();
    } catch (err) {
      readStream.close();
      writeStream.close();
      throw err;
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

module.exports = exports['default'];