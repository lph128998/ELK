'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _create = require('./create');

var _mock_server = require('./_mock_server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('POST /api/saved_objects/{type}', () => {
  const savedObjectsClient = { create: _sinon2.default.stub() };
  let server;

  beforeEach(() => {
    server = new _mock_server.MockServer();

    const prereqs = {
      getSavedObjectsClient: {
        assign: 'savedObjectsClient',
        method(request, reply) {
          reply(savedObjectsClient);
        }
      }
    };

    server.route((0, _create.createCreateRoute)(prereqs));
  });

  afterEach(() => {
    savedObjectsClient.create.reset();
  });

  it('formats successful response', async () => {
    const request = {
      method: 'POST',
      url: '/api/saved_objects/index-pattern',
      payload: {
        attributes: {
          title: 'Testing'
        }
      }
    };
    const clientResponse = {
      type: 'index-pattern',
      id: 'logstash-*',
      title: 'Testing'
    };

    savedObjectsClient.create.returns(Promise.resolve(clientResponse));

    const { payload, statusCode } = await server.inject(request);
    const response = JSON.parse(payload);

    expect(statusCode).toBe(200);
    expect(response).toEqual(clientResponse);
  });

  it('requires attributes', async () => {
    const request = {
      method: 'POST',
      url: '/api/saved_objects/index-pattern',
      payload: {}
    };

    const { statusCode, payload } = await server.inject(request);
    const response = JSON.parse(payload);

    expect(response.validation.keys).toContain('attributes');
    expect(response.message).toMatch(/is required/);
    expect(response.statusCode).toBe(400);
    expect(statusCode).toBe(400);
  });

  it('calls upon savedObjectClient.create', async () => {
    const request = {
      method: 'POST',
      url: '/api/saved_objects/index-pattern',
      payload: {
        attributes: {
          title: 'Testing'
        }
      }
    };

    await server.inject(request);
    expect(savedObjectsClient.create.calledOnce).toBe(true);

    const args = savedObjectsClient.create.getCall(0).args;
    const options = { overwrite: false, id: undefined };
    const attributes = { title: 'Testing' };

    expect(args).toEqual(['index-pattern', attributes, options]);
  });

  it('can specify an id', async () => {
    const request = {
      method: 'POST',
      url: '/api/saved_objects/index-pattern/logstash-*',
      payload: {
        attributes: {
          title: 'Testing'
        }
      }
    };

    await server.inject(request);
    expect(savedObjectsClient.create.calledOnce).toBe(true);

    const args = savedObjectsClient.create.getCall(0).args;
    const options = { overwrite: false, id: 'logstash-*' };
    const attributes = { title: 'Testing' };

    expect(args).toEqual(['index-pattern', attributes, options]);
  });
});