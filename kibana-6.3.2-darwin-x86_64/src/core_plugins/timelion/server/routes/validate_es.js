'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (server) {
  server.route({
    method: 'GET',
    path: '/api/timelion/validate/es',
    handler: async function (request, reply) {
      const uiSettings = await request.getUiSettingsService().getAll();

      const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');

      const timefield = uiSettings['timelion:es.timefield'];

      const body = {
        index: uiSettings['es.default_index'],
        body: {
          aggs: {
            maxAgg: {
              max: {
                field: timefield
              }
            },
            minAgg: {
              min: {
                field: timefield
              }
            }
          },
          size: 0
        }
      };

      let resp = {};
      try {
        resp = await callWithRequest(request, 'search', body);
      } catch (errResp) {
        resp = errResp;
      }

      if (_lodash2.default.has(resp, 'aggregations.maxAgg.value') && _lodash2.default.has(resp, 'aggregations.minAgg.value')) {
        reply({
          ok: true,
          field: timefield,
          min: _lodash2.default.get(resp, 'aggregations.minAgg.value'),
          max: _lodash2.default.get(resp, 'aggregations.maxAgg.value')
        });
        return;
      }

      reply({
        ok: false,
        resp: resp
      });
    }
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];