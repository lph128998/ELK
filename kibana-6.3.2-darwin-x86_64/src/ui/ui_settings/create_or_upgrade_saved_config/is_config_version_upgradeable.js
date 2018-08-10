'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isConfigVersionUpgradeable = isConfigVersionUpgradeable;

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rcVersionRegex = /^(\d+\.\d+\.\d+)\-rc(\d+)$/i;

function extractRcNumber(version) {
  const match = version.match(rcVersionRegex);
  return match ? [match[1], parseInt(match[2], 10)] : [version, Infinity];
}

function isConfigVersionUpgradeable(savedVersion, kibanaVersion) {
  if (typeof savedVersion !== 'string' || typeof kibanaVersion !== 'string' || savedVersion === kibanaVersion || /alpha|beta|snapshot/i.test(savedVersion)) {
    return false;
  }

  const [savedReleaseVersion, savedRcNumber] = extractRcNumber(savedVersion);
  const [kibanaReleaseVersion, kibanaRcNumber] = extractRcNumber(kibanaVersion);

  // ensure that both release versions are valid, if not then abort
  if (!_semver2.default.valid(savedReleaseVersion) || !_semver2.default.valid(kibanaReleaseVersion)) {
    return false;
  }

  // ultimately if the saved config is from a previous kibana version
  // or from an earlier rc of the same version, then we can upgrade
  const savedIsLessThanKibana = _semver2.default.lt(savedReleaseVersion, kibanaReleaseVersion);
  const savedIsSameAsKibana = _semver2.default.eq(savedReleaseVersion, kibanaReleaseVersion);
  const savedRcIsLessThanKibana = savedRcNumber < kibanaRcNumber;
  return savedIsLessThanKibana || savedIsSameAsKibana && savedRcIsLessThanKibana;
}