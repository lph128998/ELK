'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmSpecProvider = apmSpecProvider;

var _tutorial_category = require('../../../common/tutorials/tutorial_category');

var _on_prem = require('./on_prem');

var _elastic_cloud = require('./elastic_cloud');

const apmIntro = 'Collect in-depth performance metrics and errors from inside your applications.';

function isEnabled(config, key) {
  try {
    return config.get(key);
  } catch (err) {
    return false;
  }
}

function apmSpecProvider(server) {
  const config = server.config();

  const artifacts = {
    dashboards: [{
      id: '8d3ed660-7828-11e7-8c47-65b845b5cfb3',
      linkLabel: 'APM dashboard',
      isOverview: true
    }]
  };
  if (isEnabled(config, 'xpack.apm.ui.enabled')) {
    artifacts.application = {
      path: '/app/apm',
      label: 'Launch APM'
    };
  }

  return {
    id: 'apm',
    name: 'APM',
    category: _tutorial_category.TUTORIAL_CATEGORY.OTHER,
    shortDescription: apmIntro,
    longDescription: 'Application Performance Monitoring (APM) collects in-depth' + ' performance metrics and errors from inside your application.' + ' It allows you to monitor the performance of thousands of applications in real time.' + ' [Learn more]({config.docs.base_url}guide/en/apm/get-started/{config.docs.version}/index.html).',
    euiIconType: 'apmApp',
    artifacts: artifacts,
    onPrem: _on_prem.ON_PREM_INSTRUCTIONS,
    elasticCloud: _elastic_cloud.ELASTIC_CLOUD_INSTRUCTIONS,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/apm/apm.png'
  };
}