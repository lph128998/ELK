'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.netflowSpecProvider = netflowSpecProvider;

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _on_prem = require('./on_prem');

var _elastic_cloud = require('./elastic_cloud');

var _on_prem_elastic_cloud = require('./on_prem_elastic_cloud');

function netflowSpecProvider() {
  return {
    id: 'netflow',
    name: 'Netflow',
    category: _tutorial_category.TUTORIAL_CATEGORY.SECURITY,
    shortDescription: 'Collect Netflow records sent by a Netflow exporter.',
    longDescription: 'The Logstash Netflow module collects and parses network flow data, ' + ' indexes the events into Elasticsearch, and installs a suite of Kibana dashboards.' + ' This module support Netflow Version 5 and 9.' + ' [Learn more]({config.docs.logstash}/netflow-module.html).',
    completionTimeMinutes: 10,
    //previewImagePath: 'kibana-apache.png', TODO
    onPrem: _on_prem.ON_PREM_INSTRUCTIONS,
    elasticCloud: _elastic_cloud.ELASTIC_CLOUD_INSTRUCTIONS,
    onPremElasticCloud: _on_prem_elastic_cloud.ON_PREM_ELASTIC_CLOUD_INSTRUCTIONS
  };
}