'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHapiPlugins = registerHapiPlugins;

var _vision = require('vision');

var _vision2 = _interopRequireDefault(_vision);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _h2o = require('h2o2');

var _h2o2 = _interopRequireDefault(_h2o);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const plugins = [_vision2.default, _inert2.default, _h2o2.default];

async function registerPlugins(server) {
  await (0, _bluebird.fromNode)(cb => {
    server.register(plugins, cb);
  });
}

function registerHapiPlugins(server) {
  registerPlugins(server);
}