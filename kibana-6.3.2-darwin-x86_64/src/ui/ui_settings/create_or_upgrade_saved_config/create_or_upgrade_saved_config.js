'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpgradeSavedConfig = createOrUpgradeSavedConfig;

var _lodash = require('lodash');

var _get_upgradeable_config = require('./get_upgradeable_config');

async function createOrUpgradeSavedConfig(options) {
  const {
    savedObjectsClient,
    version,
    buildNum,
    log
  } = options;

  // try to find an older config we can upgrade
  const upgradeableConfig = await (0, _get_upgradeable_config.getUpgradeableConfig)({
    savedObjectsClient,
    version
  });

  if (upgradeableConfig) {
    log(['plugin', 'elasticsearch'], {
      tmpl: 'Upgrade config from <%= prevVersion %> to <%= newVersion %>',
      prevVersion: upgradeableConfig.id,
      newVersion: version
    });
  }

  // default to the attributes of the upgradeableConfig if available
  const attributes = (0, _lodash.defaults)({ buildNum }, upgradeableConfig ? upgradeableConfig.attributes : {});

  // create the new SavedConfig
  await savedObjectsClient.create('config', attributes, { id: version });
}