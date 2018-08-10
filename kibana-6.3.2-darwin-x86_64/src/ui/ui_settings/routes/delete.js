'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
async function handleRequest(request) {
  const { key } = request.params;
  const uiSettings = request.getUiSettingsService();

  await uiSettings.remove(key);
  return {
    settings: await uiSettings.getUserProvided()
  };
}

const deleteRoute = exports.deleteRoute = {
  path: '/api/kibana/settings/{key}',
  method: 'DELETE',
  handler(request, reply) {
    reply(handleRequest(request));
  }
};