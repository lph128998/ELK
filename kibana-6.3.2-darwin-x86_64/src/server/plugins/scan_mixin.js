'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanMixin = scanMixin;

var _rxjs = require('rxjs');

var _plugin_discovery = require('../../plugin_discovery');

var _lib = require('./lib');

async function scanMixin(kbnServer, server, config) {
  const {
    pack$,
    invalidDirectoryError$,
    invalidPackError$,
    otherError$,
    deprecation$,
    invalidVersionSpec$,
    spec$,
    disabledSpec$
  } = (0, _plugin_discovery.findPluginSpecs)(kbnServer.settings, config);

  const logging$ = _rxjs.Observable.merge(pack$.do(definition => {
    server.log(['plugin', 'debug'], {
      tmpl: 'Found plugin at <%= path %>',
      path: definition.getPath()
    });
  }), invalidDirectoryError$.do(error => {
    server.log(['plugin', 'warning'], {
      tmpl: '<%= err.code %>: Unable to scan directory for plugins "<%= dir %>"',
      err: error,
      dir: error.path
    });
  }), invalidPackError$.do(error => {
    server.log(['plugin', 'warning'], {
      tmpl: 'Skipping non-plugin directory at <%= path %>',
      path: error.path
    });
  }), otherError$.do(error => {
    // rethrow unhandled errors, which will fail the server
    throw error;
  }), invalidVersionSpec$.map(spec => {
    const name = spec.getId();
    const pluginVersion = spec.getExpectedKibanaVersion();
    const kibanaVersion = config.get('pkg.version');
    return `Plugin "${name}" was disabled because it expected Kibana version "${pluginVersion}", and found "${kibanaVersion}".`;
  }).distinct().do(message => {
    server.log(['plugin', 'warning'], message);
  }), deprecation$.do(({ spec, message }) => {
    server.log(['warning', spec.getConfigPrefix(), 'config', 'deprecation'], message);
  }));

  const enabledSpecs$ = spec$.toArray().do(specs => {
    kbnServer.pluginSpecs = specs;
  });

  const disabledSpecs$ = disabledSpec$.toArray().do(specs => {
    kbnServer.disabledPluginSpecs = specs;
  });

  // await completion of enabledSpecs$, disabledSpecs$, and logging$
  await _rxjs.Observable.merge(logging$, enabledSpecs$, disabledSpecs$).toPromise();

  kbnServer.plugins = kbnServer.pluginSpecs.map(spec => new _lib.Plugin(kbnServer, spec));
}