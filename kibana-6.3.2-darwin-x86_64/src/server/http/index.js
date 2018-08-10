'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _url = require('url');

var _path = require('path');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _get_default_route = require('./get_default_route');

var _get_default_route2 = _interopRequireDefault(_get_default_route);

var _version_check = require('./version_check');

var _short_url_error = require('./short_url_error');

var _short_url_assert_valid = require('./short_url_assert_valid');

var _short_url_lookup = require('./short_url_lookup');

var _setup_connection = require('./setup_connection');

var _setup_redirect_server = require('./setup_redirect_server');

var _register_hapi_plugins = require('./register_hapi_plugins');

var _setup_base_path_rewrite = require('./setup_base_path_rewrite');

var _xsrf = require('./xsrf');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (kbnServer, server, config) {
  server = kbnServer.server = new _hapi2.default.Server();

  const shortUrlLookup = (0, _short_url_lookup.shortUrlLookupProvider)(server);

  (0, _setup_connection.setupConnection)(server, config);
  (0, _setup_base_path_rewrite.setupBasePathRewrite)(server, config);
  await (0, _setup_redirect_server.setupRedirectServer)(config);
  (0, _register_hapi_plugins.registerHapiPlugins)(server);

  // provide a simple way to expose static directories
  server.decorate('server', 'exposeStaticDir', function (routePath, dirPath) {
    this.route({
      path: routePath,
      method: 'GET',
      handler: {
        directory: {
          path: dirPath,
          listing: false,
          lookupCompressed: true
        }
      },
      config: { auth: false }
    });
  });

  // helper for creating view managers for servers
  server.decorate('server', 'setupViews', function (path, engines) {
    this.views({
      path: path,
      isCached: config.get('optimize.viewCaching'),
      engines: _lodash2.default.assign({ jade: require('jade') }, engines || {})
    });
  });

  // attach the app name to the server, so we can be sure we are actually talking to kibana
  server.ext('onPreResponse', function (req, reply) {
    const response = req.response;

    const customHeaders = _extends({}, config.get('server.customResponseHeaders'), {
      'kbn-name': kbnServer.name,
      'kbn-version': kbnServer.version
    });

    if (response.isBoom) {
      response.output.headers = _extends({}, response.output.headers, customHeaders);
    } else {
      Object.keys(customHeaders).forEach(name => {
        response.header(name, customHeaders[name]);
      });
    }

    return reply.continue();
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: function (req, reply) {
      return reply.view('root_redirect', {
        hashRoute: `${config.get('server.basePath')}/app/kibana`,
        defaultRoute: (0, _get_default_route2.default)(kbnServer)
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/{p*}',
    handler: function (req, reply) {
      const path = req.path;
      if (path === '/' || path.charAt(path.length - 1) !== '/') {
        return reply(_boom2.default.notFound());
      }
      const pathPrefix = config.get('server.basePath') ? `${config.get('server.basePath')}/` : '';
      return reply.redirect((0, _url.format)({
        search: req.url.search,
        pathname: pathPrefix + path.slice(0, -1)
      })).permanent(true);
    }
  });

  server.route({
    method: 'GET',
    path: '/goto/{urlId}',
    handler: async function (request, reply) {
      try {
        const url = await shortUrlLookup.getUrl(request.params.urlId, request);
        (0, _short_url_assert_valid.shortUrlAssertValid)(url);

        const uiSettings = request.getUiSettingsService();
        const stateStoreInSessionStorage = await uiSettings.get('state:storeInSessionStorage');
        if (!stateStoreInSessionStorage) {
          reply().redirect(config.get('server.basePath') + url);
          return;
        }

        const app = server.getHiddenUiAppById('stateSessionStorageRedirect');
        reply.renderApp(app, {
          redirectUrl: url
        });
      } catch (err) {
        reply((0, _short_url_error.handleShortUrlError)(err));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/shorten',
    handler: async function (request, reply) {
      try {
        (0, _short_url_assert_valid.shortUrlAssertValid)(request.payload.url);
        const urlId = await shortUrlLookup.generateUrlId(request.payload.url, request);
        reply(urlId);
      } catch (err) {
        reply((0, _short_url_error.handleShortUrlError)(err));
      }
    }
  });

  // Expose static assets (fonts, favicons).
  server.exposeStaticDir('/ui/fonts/{path*}', (0, _path.resolve)(__dirname, '../../ui/public/assets/fonts'));
  server.exposeStaticDir('/ui/favicons/{path*}', (0, _path.resolve)(__dirname, '../../ui/public/assets/favicons'));

  (0, _version_check.setupVersionCheck)(server, config);
  (0, _xsrf.setupXsrf)(server, config);
};

module.exports = exports['default'];