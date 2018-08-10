'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metrics = undefined;

var _lodash = require('lodash');

var _case_conversion = require('../../utils/case_conversion');

var _cgroup = require('./cgroup');

class Metrics {
  constructor(config, server) {
    this.config = config;
    this.server = server;
    this.checkCGroupStats = true;
  }

  async capture(hapiEvent) {
    const timestamp = new Date().toISOString();
    const event = this.captureEvent(hapiEvent);
    const cgroup = await this.captureCGroupsIfAvailable();

    const metrics = {
      last_updated: timestamp,
      collection_interval_in_millis: this.config.get('ops.interval'),
      uptime_in_millis: process.uptime() * 1000
    };

    return (0, _lodash.merge)(metrics, event, cgroup);
  }

  captureEvent(hapiEvent) {
    const port = this.config.get('server.port');

    return {
      process: {
        mem: {
          heap_max_in_bytes: (0, _lodash.get)(hapiEvent, 'psmem.heapTotal'),
          heap_used_in_bytes: (0, _lodash.get)(hapiEvent, 'psmem.heapUsed')
        }
      },
      os: {
        cpu: {
          load_average: {
            '1m': (0, _lodash.get)(hapiEvent, 'osload.0'),
            '5m': (0, _lodash.get)(hapiEvent, 'osload.1'),
            '15m': (0, _lodash.get)(hapiEvent, 'osload.2')
          }
        }
      },
      response_times: {
        avg_in_millis: (0, _lodash.get)(hapiEvent, ['responseTimes', port, 'avg']),
        max_in_millis: (0, _lodash.get)(hapiEvent, ['responseTimes', port, 'max'])
      },
      requests: (0, _case_conversion.keysToSnakeCaseShallow)((0, _lodash.get)(hapiEvent, ['requests', port])),
      concurrent_connections: (0, _lodash.get)(hapiEvent, ['concurrents', port])
    };
  }

  async captureCGroups() {
    try {
      const cgroup = await (0, _cgroup.getAllStats)({
        cpuPath: this.config.get('cpu.cgroup.path.override'),
        cpuAcctPath: this.config.get('cpuacct.cgroup.path.override')
      });

      if ((0, _lodash.isObject)(cgroup)) {
        return {
          os: {
            cgroup
          }
        };
      }
    } catch (e) {
      this.server.log(['error', 'metrics', 'cgroup'], e);
    }
  }

  async captureCGroupsIfAvailable() {
    if (this.checkCGroupStats === true) {
      const cgroup = await this.captureCGroups();

      if ((0, _lodash.isObject)(cgroup)) {
        return cgroup;
      }

      this.checkCGroupStats = false;
    }
  }
}
exports.Metrics = Metrics;