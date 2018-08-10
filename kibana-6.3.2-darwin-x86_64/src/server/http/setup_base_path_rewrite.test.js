'use strict';

var _hapi = require('hapi');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _setup_base_path_rewrite = require('./setup_base_path_rewrite');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('server / setup_base_path_rewrite', () => {
  function createServer({ basePath, rewriteBasePath }) {
    const config = {
      get: _sinon2.default.stub()
    };

    config.get.withArgs('server.basePath').returns(basePath);
    config.get.withArgs('server.rewriteBasePath').returns(rewriteBasePath);

    const server = new _hapi.Server();
    server.connection({ port: 0 });
    (0, _setup_base_path_rewrite.setupBasePathRewrite)(server, config);

    server.route({
      method: 'GET',
      path: '/',
      handler(req, reply) {
        reply('resp:/');
      }
    });

    server.route({
      method: 'GET',
      path: '/foo',
      handler(req, reply) {
        reply('resp:/foo');
      }
    });

    return server;
  }

  describe('no base path', () => {
    let server;
    beforeAll(() => server = createServer({ basePath: '', rewriteBasePath: false }));
    afterAll(() => server = undefined);

    it('/bar => 404', async () => {
      const resp = await server.inject({
        url: '/bar'
      });

      expect(resp.statusCode).toBe(404);
    });

    it('/bar/ => 404', async () => {
      const resp = await server.inject({
        url: '/bar/'
      });

      expect(resp.statusCode).toBe(404);
    });

    it('/bar/foo => 404', async () => {
      const resp = await server.inject({
        url: '/bar/foo'
      });

      expect(resp.statusCode).toBe(404);
    });

    it('/ => /', async () => {
      const resp = await server.inject({
        url: '/'
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.payload).toBe('resp:/');
    });

    it('/foo => /foo', async () => {
      const resp = await server.inject({
        url: '/foo'
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.payload).toBe('resp:/foo');
    });
  });

  describe('base path /bar, rewrite = false', () => {
    let server;
    beforeAll(() => server = createServer({ basePath: '/bar', rewriteBasePath: false }));
    afterAll(() => server = undefined);

    it('/bar => 404', async () => {
      const resp = await server.inject({
        url: '/bar'
      });

      expect(resp.statusCode).toBe(404);
    });

    it('/bar/ => 404', async () => {
      const resp = await server.inject({
        url: '/bar/'
      });

      expect(resp.statusCode).toBe(404);
    });

    it('/bar/foo => 404', async () => {
      const resp = await server.inject({
        url: '/bar/foo'
      });

      expect(resp.statusCode).toBe(404);
    });

    it('/ => /', async () => {
      const resp = await server.inject({
        url: '/'
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.payload).toBe('resp:/');
    });

    it('/foo => /foo', async () => {
      const resp = await server.inject({
        url: '/foo'
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.payload).toBe('resp:/foo');
    });
  });

  describe('base path /bar, rewrite = true', () => {
    let server;
    beforeAll(() => server = createServer({ basePath: '/bar', rewriteBasePath: true }));
    afterAll(() => server = undefined);

    it('/bar => /', async () => {
      const resp = await server.inject({
        url: '/bar'
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.payload).toBe('resp:/');
    });

    it('/bar/ => 404', async () => {
      const resp = await server.inject({
        url: '/bar/'
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.payload).toBe('resp:/');
    });

    it('/bar/foo => 404', async () => {
      const resp = await server.inject({
        url: '/bar/foo'
      });

      expect(resp.statusCode).toBe(200);
      expect(resp.payload).toBe('resp:/foo');
    });

    it('/ => 404', async () => {
      const resp = await server.inject({
        url: '/'
      });

      expect(resp.statusCode).toBe(404);
    });

    it('/foo => 404', async () => {
      const resp = await server.inject({
        url: '/foo'
      });

      expect(resp.statusCode).toBe(404);
    });
  });
});