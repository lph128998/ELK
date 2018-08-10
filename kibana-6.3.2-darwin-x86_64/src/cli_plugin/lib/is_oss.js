'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOSS = isOSS;
function isOSS() {
  try {
    require.resolve('x-pack');
    return false;
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }

    return true;
  }
}