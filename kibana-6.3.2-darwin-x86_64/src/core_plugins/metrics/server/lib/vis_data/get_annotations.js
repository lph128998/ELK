'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _build_annotation_request = require('./build_annotation_request');

var _build_annotation_request2 = _interopRequireDefault(_build_annotation_request);

var _handle_annotation_response = require('./handle_annotation_response');

var _handle_annotation_response2 = _interopRequireDefault(_handle_annotation_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validAnnotation(annotation) {
  return annotation.index_pattern && annotation.time_field && annotation.fields && annotation.icon && annotation.template;
}

exports.default = async (req, panel) => {
  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('data');
  const bodies = panel.annotations.filter(validAnnotation).map(annotation => {

    const indexPattern = annotation.index_pattern;
    const bodies = [];

    bodies.push({
      index: indexPattern,
      ignore: [404],
      timeout: '90s',
      requestTimeout: 90000,
      ignoreUnavailable: true
    });

    bodies.push((0, _build_annotation_request2.default)(req, panel, annotation));
    return bodies;
  });

  if (!bodies.length) return { responses: [] };
  try {
    const resp = await callWithRequest(req, 'msearch', {
      body: bodies.reduce((acc, item) => acc.concat(item), [])
    });
    const results = {};
    panel.annotations.filter(validAnnotation).forEach((annotation, index) => {
      const data = resp.responses[index];
      results[annotation.id] = (0, _handle_annotation_response2.default)(data, annotation);
    });
    return results;
  } catch (error) {
    if (error.message === 'missing-indices') return { responses: [] };
    throw error;
  }
};

module.exports = exports['default'];