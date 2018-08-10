'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _download = require('./download');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cleanup = require('./cleanup');

var _pack = require('./pack');

var _rename = require('./rename');

var _rimraf = require('rimraf');

var _error_if_x_pack = require('../lib/error_if_x_pack');

var _kibana = require('./kibana');

var _pm = require('@kbn/pm');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mkdir = _bluebird2.default.promisify(_mkdirp2.default);

exports.default = async function install(settings, logger) {
  try {
    (0, _error_if_x_pack.errorIfXPackInstall)(settings, logger);

    await (0, _cleanup.cleanPrevious)(settings, logger);

    await mkdir(settings.workingPath);

    await (0, _download.download)(settings, logger);

    await (0, _pack.getPackData)(settings, logger);

    await (0, _pack.extract)(settings, logger);

    (0, _rimraf.sync)(settings.tempArchiveFile);

    (0, _kibana.existingInstall)(settings, logger);

    (0, _kibana.assertVersion)(settings);

    await (0, _pm.prepareExternalProjectDependencies)(settings.workingPath);

    await (0, _rename.renamePlugin)(settings.workingPath, _path2.default.join(settings.pluginDir, settings.plugins[0].name));

    await (0, _kibana.rebuildCache)(settings, logger);

    logger.log('Plugin installation complete');
  } catch (err) {
    logger.error(`Plugin installation was unsuccessful due to error "${err.message}"`);
    (0, _cleanup.cleanArtifacts)(settings);
    process.exit(70); // eslint-disable-line no-process-exit
  }
};

module.exports = exports['default'];