'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hapi = require('hapi');

var _bluebird = require('bluebird');

var _register_hapi_plugins = require('../../server/http/register_hapi_plugins');

class WatchServer {
  constructor(host, port, basePath, optimizer) {
    this.basePath = basePath;
    this.optimizer = optimizer;
    this.server = new _hapi.Server();

    (0, _register_hapi_plugins.registerHapiPlugins)(this.server);

    this.server.connection({
      host: host,
      port: port
    });
  }

  async init() {
    await this.optimizer.init();
    this.optimizer.bindToServer(this.server, this.basePath);
    await (0, _bluebird.fromNode)(cb => this.server.start(cb));
  }
}
exports.default = WatchServer;
module.exports = exports['default'];