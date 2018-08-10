'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wreck = require('wreck');

var _wreck2 = _interopRequireDefault(_wreck);

var _progress = require('../progress');

var _progress2 = _interopRequireDefault(_progress);

var _bluebird = require('bluebird');

var _fs = require('fs');

var _httpProxyAgent = require('http-proxy-agent');

var _httpProxyAgent2 = _interopRequireDefault(_httpProxyAgent);

var _httpsProxyAgent = require('https-proxy-agent');

var _httpsProxyAgent2 = _interopRequireDefault(_httpsProxyAgent);

var _proxyFromEnv = require('proxy-from-env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProxyAgent(sourceUrl, logger) {
  const proxy = (0, _proxyFromEnv.getProxyForUrl)(sourceUrl);

  if (!proxy) {
    return null;
  }

  logger.log(`Picked up proxy ${proxy} from environment variable.`);

  if (/^https/.test(sourceUrl)) {
    return new _httpsProxyAgent2.default(proxy);
  } else {
    return new _httpProxyAgent2.default(proxy);
  }
}

function sendRequest({ sourceUrl, timeout }, logger) {
  const maxRedirects = 11; //Because this one goes to 11.
  return (0, _bluebird.fromNode)(cb => {
    const reqOptions = { timeout, redirects: maxRedirects };
    const proxyAgent = getProxyAgent(sourceUrl, logger);

    if (proxyAgent) {
      reqOptions.agent = proxyAgent;
    }

    const req = _wreck2.default.request('GET', sourceUrl, reqOptions, (err, resp) => {
      if (err) {
        if (err.code === 'ECONNREFUSED') {
          err = new Error('ENOTFOUND');
        }

        return cb(err);
      }

      if (resp.statusCode >= 400) {
        return cb(new Error('ENOTFOUND'));
      }

      cb(null, { req, resp });
    });
  });
}

function downloadResponse({ resp, targetPath, progress }) {
  return new Promise((resolve, reject) => {
    const writeStream = (0, _fs.createWriteStream)(targetPath);

    // if either stream errors, fail quickly
    resp.on('error', reject);
    writeStream.on('error', reject);

    // report progress as we download
    resp.on('data', chunk => {
      progress.progress(chunk.length);
    });

    // write the download to the file system
    resp.pipe(writeStream);

    // when the write is done, we are done
    writeStream.on('finish', resolve);
  });
}

/*
Responsible for managing http transfers
*/

exports.default = async function downloadUrl(logger, sourceUrl, targetPath, timeout) {
  try {
    const { req, resp } = await sendRequest({ sourceUrl, timeout }, logger);

    try {
      const totalSize = parseFloat(resp.headers['content-length']) || 0;
      const progress = new _progress2.default(logger);
      progress.init(totalSize);

      await downloadResponse({ resp, targetPath, progress });

      progress.complete();
    } catch (err) {
      req.abort();
      throw err;
    }
  } catch (err) {
    if (err.message !== 'ENOTFOUND') {
      logger.error(err);
    }
    throw err;
  }
};

module.exports = exports['default'];