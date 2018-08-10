'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (program) {
  const command = program.command('serve');

  command.description('Run the kibana server').collectUnknownOptions().option('-e, --elasticsearch <uri>', 'Elasticsearch instance').option('-c, --config <path>', 'Path to the config file, can be changed with the CONFIG_PATH environment variable as well. ' + 'Use multiple --config args to include multiple config files.', configPathCollector, [(0, _path2.getConfig)()]).option('-p, --port <port>', 'The port to bind to', parseInt).option('-q, --quiet', 'Prevent all logging except errors').option('-Q, --silent', 'Prevent all logging').option('--verbose', 'Turns on verbose logging').option('-H, --host <host>', 'The host to bind to').option('-l, --log-file <path>', 'The file to log to').option('--plugin-dir <path>', 'A path to scan for plugins, this can be specified multiple ' + 'times to specify multiple directories', pluginDirCollector, [(0, _utils.fromRoot)('plugins'), (0, _utils.fromRoot)('src/core_plugins')]).option('--plugin-path <path>', 'A path to a plugin which should be included by the server, ' + 'this can be specified multiple times to specify multiple paths', pluginPathCollector, []).option('--plugins <path>', 'an alias for --plugin-dir', pluginDirCollector);

  if (XPACK_OPTIONAL) {
    command.option('--oss', 'Start Kibana without X-Pack');
  }

  if (CAN_CLUSTER) {
    command.option('--dev', 'Run the server with development mode defaults').option('--ssl', 'Run the dev server using HTTPS').option('--no-base-path', 'Don\'t put a proxy in front of the dev server, which adds a random basePath').option('--no-watch', 'Prevents automatic restarts of the server in --dev mode');
  }

  command.action(async function (opts) {
    if (opts.dev) {
      try {
        const kbnDevConfig = (0, _utils.fromRoot)('config/kibana.dev.yml');
        if ((0, _fs.statSync)(kbnDevConfig).isFile()) {
          opts.config.push(kbnDevConfig);
        }
      } catch (err) {
        // ignore, kibana.dev.yml does not exist
      }
    }

    const getCurrentSettings = () => readServerSettings(opts, this.getUnknownOptions());
    const settings = getCurrentSettings();

    if (CAN_CLUSTER && opts.dev && !_cluster.isWorker) {
      // stop processing the action and handoff to cluster manager
      const ClusterManager = require(CLUSTER_MANAGER_PATH);
      new ClusterManager(opts, settings);
      return;
    }

    let kbnServer = {};
    const KbnServer = require('../../server/kbn_server');
    try {
      kbnServer = new KbnServer(settings);
      await kbnServer.ready();
    } catch (error) {
      const { server } = kbnServer;

      switch (error.code) {
        case 'EADDRINUSE':
          logFatal(`Port ${error.port} is already in use. Another instance of Kibana may be running!`, server);
          break;

        case 'InvalidConfig':
          logFatal(error.message, server);
          break;

        default:
          logFatal(error, server);
          break;
      }

      kbnServer.close();
      const exitCode = error.processExitCode == null ? 1 : error.processExitCode;
      // eslint-disable-next-line no-process-exit
      process.exit(exitCode);
    }

    process.on('SIGHUP', function reloadConfig() {
      const settings = getCurrentSettings();
      kbnServer.server.log(['info', 'config'], 'Reloading logging configuration due to SIGHUP.');
      kbnServer.applyLoggingConfiguration(settings);
      kbnServer.server.log(['info', 'config'], 'Reloaded logging configuration due to SIGHUP.');
    });

    return kbnServer;
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _cluster = require('cluster');

var _path = require('path');

var _utils = require('../../utils');

var _path2 = require('../../server/path');

var _read_yaml_config = require('./read_yaml_config');

var _read_keystore = require('./read_keystore');

var _dev_ssl = require('../dev_ssl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function canRequire(path) {
  try {
    require.resolve(path);
    return true;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return false;
    } else {
      throw error;
    }
  }
}

function isSymlinkTo(link, dest) {
  try {
    const stat = (0, _fs.lstatSync)(link);
    return stat.isSymbolicLink() && (0, _fs.realpathSync)(link) === dest;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

const CLUSTER_MANAGER_PATH = (0, _path.resolve)(__dirname, '../cluster/cluster_manager');
const CAN_CLUSTER = canRequire(CLUSTER_MANAGER_PATH);

// xpack is installed in both dev and the distributable, it's optional if
// install is a link to the source, not an actual install
const XPACK_INSTALLED_DIR = (0, _path.resolve)(__dirname, '../../../node_modules/x-pack');
const XPACK_SOURCE_DIR = (0, _path.resolve)(__dirname, '../../../x-pack');
const XPACK_INSTALLED = canRequire(XPACK_INSTALLED_DIR);
const XPACK_OPTIONAL = isSymlinkTo(XPACK_INSTALLED_DIR, XPACK_SOURCE_DIR);

const pathCollector = function () {
  const paths = [];
  return function (path) {
    paths.push((0, _path.resolve)(process.cwd(), path));
    return paths;
  };
};

const configPathCollector = pathCollector();
const pluginDirCollector = pathCollector();
const pluginPathCollector = pathCollector();

function readServerSettings(opts, extraCliOptions) {
  const settings = (0, _read_yaml_config.readYamlConfig)(opts.config);
  const set = _lodash2.default.partial(_lodash2.default.set, settings);
  const get = _lodash2.default.partial(_lodash2.default.get, settings);
  const has = _lodash2.default.partial(_lodash2.default.has, settings);
  const merge = _lodash2.default.partial(_lodash2.default.merge, settings);

  if (opts.dev) {
    set('env', 'development');
    set('optimize.watch', true);

    if (!has('elasticsearch.username')) {
      set('elasticsearch.username', 'elastic');
    }

    if (!has('elasticsearch.password')) {
      set('elasticsearch.password', 'changeme');
    }

    if (opts.ssl) {
      set('server.ssl.enabled', true);
    }

    if (opts.ssl && !has('server.ssl.certificate') && !has('server.ssl.key')) {
      set('server.ssl.certificate', _dev_ssl.DEV_SSL_CERT_PATH);
      set('server.ssl.key', _dev_ssl.DEV_SSL_KEY_PATH);
    }
  }

  if (opts.elasticsearch) set('elasticsearch.url', opts.elasticsearch);
  if (opts.port) set('server.port', opts.port);
  if (opts.host) set('server.host', opts.host);
  if (opts.quiet) set('logging.quiet', true);
  if (opts.silent) set('logging.silent', true);
  if (opts.verbose) set('logging.verbose', true);
  if (opts.logFile) set('logging.dest', opts.logFile);

  set('plugins.scanDirs', _lodash2.default.compact([].concat(get('plugins.scanDirs'), opts.pluginDir)));

  set('plugins.paths', _lodash2.default.compact([].concat(get('plugins.paths'), opts.pluginPath, XPACK_INSTALLED && (!XPACK_OPTIONAL || !opts.oss) ? [XPACK_INSTALLED_DIR] : [])));

  merge((0, _read_keystore.readKeystore)());
  merge(extraCliOptions);

  return settings;
}

function logFatal(message, server) {
  if (server) {
    server.log(['fatal'], message);
  }

  // It's possible for the Hapi logger to not be setup
  console.error('FATAL', message);
}
module.exports = exports['default'];