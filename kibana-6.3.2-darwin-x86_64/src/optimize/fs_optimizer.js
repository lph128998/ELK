'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base_optimizer = require('./base_optimizer');

var _base_optimizer2 = _interopRequireDefault(_base_optimizer);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FsOptimizer extends _base_optimizer2.default {
  async init() {
    await this.initCompiler();
  }

  async run() {
    if (!this.compiler) await this.init();

    await (0, _bluebird.fromNode)(cb => {
      this.compiler.run((err, stats) => {
        if (err || !stats) return cb(err);

        if (stats.hasErrors() || stats.hasWarnings()) {
          return cb(this.failedStatsToError(stats));
        } else {
          cb(null, stats);
        }
      });
    });
  }
}
exports.default = FsOptimizer;
module.exports = exports['default'];