'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRoute = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function handleRequest(request) {
  const { key } = request.params;
  const { value } = request.payload;
  const uiSettings = request.getUiSettingsService();

  await uiSettings.set(key, value);

  return {
    settings: await uiSettings.getUserProvided()
  };
}

const setRoute = exports.setRoute = {
  path: '/api/kibana/settings/{key}',
  method: 'POST',
  config: {
    validate: {
      params: _joi2.default.object().keys({
        key: _joi2.default.string().required()
      }).default(),

      payload: _joi2.default.object().keys({
        value: _joi2.default.any().required()
      }).required()
    },
    handler(request, reply) {
      reply(handleRequest(request));
    }
  }
};