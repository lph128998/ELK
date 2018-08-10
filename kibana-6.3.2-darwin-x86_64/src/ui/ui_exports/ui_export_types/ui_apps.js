'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = exports.apps = undefined;

var _lodash = require('lodash');

var _reduce = require('./reduce');

var _modify_reduce = require('./modify_reduce');

function applySpecDefaults(spec, type, pluginSpec) {
  const pluginId = pluginSpec.getId();
  const {
    id = pluginId,
    main,
    title,
    order = 0,
    description = '',
    icon,
    hidden = false,
    linkToLastSubUrl = true,
    listed = !hidden,
    url = `/app/${id}`,
    uses = []
  } = spec;

  if (spec.injectVars) {
    throw new Error(`[plugin:${pluginId}] uiExports.app.injectVars has been removed. Use server.injectUiAppVars('${id}', () => { ... })`);
  }

  return {
    pluginId,
    id,
    main,
    title,
    order,
    description,
    icon,
    hidden,
    linkToLastSubUrl,
    listed,
    url,
    uses: (0, _lodash.uniq)([...uses, 'chromeNavControls', 'hacks'])
  };
}

const apps = exports.apps = (0, _modify_reduce.wrap)((0, _modify_reduce.alias)('uiAppSpecs'), (0, _modify_reduce.mapSpec)(applySpecDefaults), _reduce.flatConcatAtType);
const app = exports.app = (0, _modify_reduce.wrap)((0, _modify_reduce.alias)('uiAppSpecs'), (0, _modify_reduce.mapSpec)(applySpecDefaults), _reduce.flatConcatAtType);