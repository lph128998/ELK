'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
async function handleRequest(request) {
  const uiSettings = request.getUiSettingsService();
  return {
    settings: await uiSettings.getUserProvided()
  };
}

const getRoute = exports.getRoute = {
  path: '/api/kibana/settings',
  method: 'GET',
  handler: function (request, reply) {
    reply(handleRequest(request));
  }
};