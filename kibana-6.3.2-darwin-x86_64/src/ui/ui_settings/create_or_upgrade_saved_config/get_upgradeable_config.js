'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUpgradeableConfig = getUpgradeableConfig;

var _is_config_version_upgradeable = require('./is_config_version_upgradeable');

/**
 *  Find the most recent SavedConfig that is upgradeable to the specified version
 *  @param {Object} options
 *  @property {SavedObjectsClient} savedObjectsClient
 *  @property {string} version
 *  @return {Promise<SavedConfig|undefined>}
 */
async function getUpgradeableConfig({ savedObjectsClient, version }) {
  // attempt to find a config we can upgrade
  const { saved_objects: savedConfigs } = await savedObjectsClient.find({
    type: 'config',
    page: 1,
    perPage: 1000,
    sortField: 'buildNum',
    sortOrder: 'desc'
  });

  // try to find a config that we can upgrade
  return savedConfigs.find(savedConfig => (0, _is_config_version_upgradeable.isConfigVersionUpgradeable)(savedConfig.id, version));
}