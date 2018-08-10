'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRedirectServer = setupRedirectServer;

var _url = require('url');

var _bluebird = require('bluebird');

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// If a redirect port is specified, we start an http server at this port and
// redirect all requests to the ssl port.
async function setupRedirectServer(config) {
  const isSslEnabled = config.get('server.ssl.enabled');
  const portToRedirectFrom = config.get('server.ssl.redirectHttpFromPort');

  // Both ssl and port to redirect from must be specified
  if (!isSslEnabled || portToRedirectFrom === undefined) {
    return;
  }

  const host = config.get('server.host');
  const sslPort = config.get('server.port');

  if (portToRedirectFrom === sslPort) {
    throw new Error('Kibana does not accept http traffic to `server.port` when ssl is ' + 'enabled (only https is allowed), so `server.ssl.redirectHttpFromPort` ' + `cannot be configured to the same value. Both are [${sslPort}].`);
  }

  const redirectServer = new _hapi2.default.Server();

  redirectServer.connection({
    host,
    port: portToRedirectFrom
  });

  redirectServer.ext('onRequest', (req, reply) => {
    reply.redirect((0, _url.format)({
      protocol: 'https',
      hostname: host,
      port: sslPort,
      pathname: req.url.pathname,
      search: req.url.search
    }));
  });

  try {
    await (0, _bluebird.fromNode)(cb => redirectServer.start(cb));
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      throw new Error('The redirect server failed to start up because port ' + `${portToRedirectFrom} is already in use. Ensure the port specified ` + 'in `server.ssl.redirectHttpFromPort` is available.');
    } else {
      throw err;
    }
  }
}