'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callPluginHook = callPluginHook;

var _lodash = require('lodash');

async function callPluginHook(hookName, plugins, id, history) {
  const plugin = plugins.find(plugin => plugin.id === id);

  // make sure this is a valid plugin id
  if (!plugin) {
    if (history.length) {
      throw new Error(`Unmet requirement "${id}" for plugin "${(0, _lodash.last)(history)}"`);
    } else {
      throw new Error(`Unknown plugin "${id}"`);
    }
  }

  const circleStart = history.indexOf(id);
  const path = [...history, id];

  // make sure we are not trying to load a dependency within itself
  if (circleStart > -1) {
    const circle = path.slice(circleStart);
    throw new Error(`circular dependency found: "${circle.join(' -> ')}"`);
  }

  // call hook on all dependencies
  for (const req of plugin.requiredIds) {
    await callPluginHook(hookName, plugins, req, path);
  }

  // call hook on this plugin
  await plugin[hookName]();
}