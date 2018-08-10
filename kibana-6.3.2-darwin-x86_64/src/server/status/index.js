'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statusMixin = statusMixin;

var _server_status = require('./server_status');

var _server_status2 = _interopRequireDefault(_server_status);

var _metrics = require('./metrics');

var _routes = require('./routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function statusMixin(kbnServer, server, config) {
  kbnServer.status = new _server_status2.default(kbnServer.server);

  if (server.plugins['even-better']) {
    const metrics = new _metrics.Metrics(config, server);

    server.plugins['even-better'].monitor.on('ops', event => {
      metrics.capture(event).then(data => {
        kbnServer.metrics = data;
      });
    });
  }

  // init routes
  (0, _routes.registerStatusPage)(kbnServer, server, config);
  (0, _routes.registerStatusApi)(kbnServer, server, config);
}