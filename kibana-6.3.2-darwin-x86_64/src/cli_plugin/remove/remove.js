'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = remove;

var _fs = require('fs');

var _error_if_x_pack = require('../lib/error_if_x_pack');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function remove(settings, logger) {
  try {
    let stat;
    try {
      stat = (0, _fs.statSync)(settings.pluginPath);
    } catch (e) {
      (0, _error_if_x_pack.errorIfXPackRemove)(settings, logger);
      throw new Error(`Plugin [${settings.plugin}] is not installed`);
    }

    if (!stat.isDirectory()) {
      throw new Error(`[${settings.plugin}] is not a plugin`);
    }

    logger.log(`Removing ${settings.plugin}...`);
    _rimraf2.default.sync(settings.pluginPath);
    logger.log('Plugin removal complete');
  } catch (err) {
    logger.error(`Unable to remove plugin because of error: "${err.message}"`);
    process.exit(74); // eslint-disable-line no-process-exit
  }
}
module.exports = exports['default'];