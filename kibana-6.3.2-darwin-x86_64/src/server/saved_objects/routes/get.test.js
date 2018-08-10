'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _get = require('./get');

var _mock_server = require('./_mock_server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('GET /api/saved_objects/{type}/{id}', () => {
  const savedObjectsClient = { get: _sinon2.default.stub() };
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

    server.route((0, _get.createGetRoute)(prereqs));
  });

  afterEach(() => {
    savedObjectsClient.get.reset();
  });

  it('formats successful response', async () => {
    const request = {
      method: 'GET',
      url: '/api/saved_objects/index-pattern/logstash-*'
    };
    const clientResponse = {
      id: 'logstash-*',
      title: 'logstash-*',
      timeFieldName: '@timestamp',
      notExpandable: true
    };

    savedObjectsClient.get.returns(Promise.resolve(clientResponse));

    const { payload, statusCode } = await server.inject(request);
    const response = JSON.parse(payload);

    expect(statusCode).toBe(200);
    expect(response).toEqual(clientResponse);
  });

  it('calls upon savedObjectClient.get', async () => {
    const request = {
      method: 'GET',
      url: '/api/saved_objects/index-pattern/logstash-*'
    };

    await server.inject(request);
    expect(savedObjectsClient.get.calledOnce).toBe(true);

    const args = savedObjectsClient.get.getCall(0).args;
    expect(args).toEqual(['index-pattern', 'logstash-*']);
  });
});