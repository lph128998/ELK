'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsMixin = savedObjectsMixin;

var _client = require('./client');

var _routes = require('./routes');

function savedObjectsMixin(kbnServer, server) {
  const prereqs = {
    getSavedObjectsClient: {
      assign: 'savedObjectsClient',
      method(req, reply) {
        reply(req.getSavedObjectsClient());
      }
    }
  };

  server.route((0, _routes.createBulkGetRoute)(prereqs));
  server.route((0, _routes.createCreateRoute)(prereqs));
  server.route((0, _routes.createDeleteRoute)(prereqs));
  server.route((0, _routes.createFindRoute)(prereqs));
  server.route((0, _routes.createGetRoute)(prereqs));
  server.route((0, _routes.createUpdateRoute)(prereqs));

  async function onBeforeWrite() {
    const adminCluster = server.plugins.elasticsearch.getCluster('admin');

    try {
      const index = server.config().get('kibana.index');
      await adminCluster.callWithInternalUser('indices.putTemplate', {
        name: `kibana_index_template:${index}`,
        body: {
          template: index,
          settings: {
            number_of_shards: 1,
            auto_expand_replicas: '0-1'
          },
          mappings: server.getKibanaIndexMappingsDsl()
        }
      });
    } catch (error) {
      server.log(['debug', 'savedObjects'], {
        tmpl: 'Attempt to write indexTemplate for SavedObjects index failed: <%= err.message %>',
        es: {
          resp: error.body,
          status: error.status
        },
        err: {
          message: error.message,
          stack: error.stack
        }
      });

      // We reject with `es.ServiceUnavailable` because writing an index
      // template is a very simple operation so if we get an error here
      // then something must be very broken
      throw new adminCluster.errors.ServiceUnavailable();
    }
  }

  server.decorate('server', 'savedObjectsClientFactory', ({ callCluster }) => {
    return new _client.SavedObjectsClient({
      index: server.config().get('kibana.index'),
      mappings: server.getKibanaIndexMappingsDsl(),
      callCluster,
      onBeforeWrite
    });
  });

  const savedObjectsClientCache = new WeakMap();
  server.decorate('request', 'getSavedObjectsClient', function () {
    const request = this;

    if (savedObjectsClientCache.has(request)) {
      return savedObjectsClientCache.get(request);
    }

    const { callWithRequest } = server.plugins.elasticsearch.getCluster('admin');
    const callCluster = (...args) => callWithRequest(request, ...args);
    const savedObjectsClient = server.savedObjectsClientFactory({ callCluster });

    savedObjectsClientCache.set(request, savedObjectsClient);
    return savedObjectsClient;
  });
}