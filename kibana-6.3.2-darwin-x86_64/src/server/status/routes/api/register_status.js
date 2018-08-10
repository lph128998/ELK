'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStatusApi = registerStatusApi;

var _wrap_auth_config = require('../../wrap_auth_config');

const matchSnapshot = /-SNAPSHOT$/;

function registerStatusApi(kbnServer, server, config) {
  const wrapAuth = (0, _wrap_auth_config.wrapAuthConfig)(config.get('status.allowAnonymous'));

  server.route(wrapAuth({
    method: 'GET',
    path: '/api/status',
    config: {
      tags: ['api']
    },
    async handler(request, reply) {
      const status = {
        name: config.get('server.name'),
        uuid: config.get('server.uuid'),
        version: {
          number: config.get('pkg.version').replace(matchSnapshot, ''),
          build_hash: config.get('pkg.buildSha'),
          build_number: config.get('pkg.buildNum'),
          build_snapshot: matchSnapshot.test(config.get('pkg.version'))
        },
        status: kbnServer.status.toJSON(),
        metrics: kbnServer.metrics
      };

      return reply(status);
    }
  }));
}