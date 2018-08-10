'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setManyRoute = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function handleRequest(request) {
  const { changes } = request.payload;
  const uiSettings = request.getUiSettingsService();

  await uiSettings.setMany(changes);

  return {
    settings: await uiSettings.getUserProvided()
  };
}

const setManyRoute = exports.setManyRoute = {
  path: '/api/kibana/settings',
  method: 'POST',
  config: {
    validate: {
      payload: _joi2.default.object().keys({
        changes: _joi2.default.object().unknown(true).required()
      }).required()
    },
    handler(request, reply) {
      reply(handleRequest(request));
    }
  }
};