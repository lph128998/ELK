'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _bulk_get = require('./bulk_get');

var _mock_server = require('./_mock_server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('POST /api/saved_objects/_bulk_get', () => {
  const savedObjectsClient = { bulkGet: _sinon2.default.stub() };
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

    server.route((0, _bulk_get.createBulkGetRoute)(prereqs));
  });

  afterEach(() => {
    savedObjectsClient.bulkGet.reset();
  });

  it('formats successful response', async () => {
    const request = {
      method: 'POST',
      url: '/api/saved_objects/_bulk_get',
      payload: [{
        id: 'abc123',
        type: 'index-pattern'
      }]
    };

    const clientResponse = {
      saved_objects: [{
        id: 'abc123',
        type: 'index-pattern',
        title: 'logstash-*',
        version: 2
      }]
    };

    savedObjectsClient.bulkGet.returns(Promise.resolve(clientResponse));

    const { payload, statusCode } = await server.inject(request);
    const response = JSON.parse(payload);

    expect(statusCode).toBe(200);
    expect(response).toEqual(clientResponse);
  });

  it('calls upon savedObjectClient.bulkGet', async () => {
    const docs = [{
      id: 'abc123',
      type: 'index-pattern'
    }];

    const request = {
      method: 'POST',
      url: '/api/saved_objects/_bulk_get',
      payload: docs
    };

    await server.inject(request);
    expect(savedObjectsClient.bulkGet.calledOnce).toBe(true);

    const args = savedObjectsClient.bulkGet.getCall(0).args;
    expect(args[0]).toEqual(docs);
  });
});