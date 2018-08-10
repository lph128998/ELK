'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = merge;
exports.readYamlConfig = readYamlConfig;

var _lodash = require('lodash');

var _fs = require('fs');

var _jsYaml = require('js-yaml');

function replaceEnvVarRefs(val) {
  return val.replace(/\$\{(\w+)\}/g, (match, envVarName) => {
    if (process.env[envVarName] !== undefined) {
      return process.env[envVarName];
    } else {
      throw new Error(`Unknown environment variable referenced in config : ${envVarName}`);
    }
  });
}

function merge(sources) {
  return (0, _lodash.transform)(sources, (merged, source) => {
    (0, _lodash.forOwn)(source, function apply(val, key) {
      if ((0, _lodash.isPlainObject)(val)) {
        (0, _lodash.forOwn)(val, function (subVal, subKey) {
          apply(subVal, key + '.' + subKey);
        });
        return;
      }

      if ((0, _lodash.isArray)(val)) {
        (0, _lodash.set)(merged, key, []);
        val.forEach((subVal, i) => apply(subVal, key + '.' + i));
        return;
      }

      if ((0, _lodash.isString)(val)) {
        val = replaceEnvVarRefs(val);
      }

      (0, _lodash.set)(merged, key, val);
    });
  }, {});
}

function readYamlConfig(paths) {
  const files = [].concat(paths || []);
  const yamls = files.map(path => (0, _jsYaml.safeLoad)((0, _fs.readFileSync)(path, 'utf8')));
  return merge(yamls);
}