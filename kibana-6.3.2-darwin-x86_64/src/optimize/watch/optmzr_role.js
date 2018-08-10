'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watch_server = require('./watch_server');

var _watch_server2 = _interopRequireDefault(_watch_server);

var _watch_optimizer = require('./watch_optimizer');

var _watch_optimizer2 = _interopRequireDefault(_watch_optimizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async (kbnServer, kibanaHapiServer, config) => {
  const server = new _watch_server2.default(config.get('optimize.watchHost'), config.get('optimize.watchPort'), config.get('server.basePath'), new _watch_optimizer2.default({
    log: (tags, data) => kibanaHapiServer.log(tags, data),
    uiBundles: kbnServer.uiBundles,
    profile: config.get('optimize.profile'),
    sourceMaps: config.get('optimize.sourceMaps'),
    prebuild: config.get('optimize.watchPrebuild'),
    unsafeCache: config.get('optimize.unsafeCache')
  }));

  let ready = false;

  const sendReady = () => {
    if (!process.connected) return;
    process.send(['WORKER_BROADCAST', { optimizeReady: ready }]);
  };

  process.on('message', msg => {
    if (msg && msg.optimizeReady === '?') sendReady();
  });

  sendReady();

  await server.init();

  ready = true;
  sendReady();
};

module.exports = exports['default'];