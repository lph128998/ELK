'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClusters = createClusters;

var _cluster = require('./cluster');

function createClusters(server) {
  const clusters = new Map();

  server.on('stop', () => {
    for (const [name, cluster] of clusters) {
      cluster.close();
      clusters.delete(name);
    }
  });

  return {
    get(name) {
      return clusters.get(name);
    },

    create(name, config) {
      const cluster = new _cluster.Cluster(config);

      if (clusters.has(name)) {
        throw new Error(`cluster '${name}' already exists`);
      }

      clusters.set(name, cluster);

      return cluster;
    }
  };
}