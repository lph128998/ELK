'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupBasePathRewrite = setupBasePathRewrite;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupBasePathRewrite(server, config) {
  const basePath = config.get('server.basePath');
  const rewriteBasePath = config.get('server.rewriteBasePath');

  if (!basePath || !rewriteBasePath) {
    return;
  }

  server.ext('onRequest', (request, reply) => {
    const newUrl = (0, _utils.modifyUrl)(request.url.href, parsed => {
      if (parsed.pathname.startsWith(basePath)) {
        parsed.pathname = parsed.pathname.replace(basePath, '') || '/';
      } else {
        return {};
      }
    });

    if (!newUrl) {
      reply(_boom2.default.notFound());
      return;
    }

    request.setUrl(newUrl);
    reply.continue();
  });
}