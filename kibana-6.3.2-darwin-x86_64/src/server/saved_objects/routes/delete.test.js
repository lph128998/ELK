'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _delete = require('./delete');

var _mock_server = require('./_mock_server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('DELETE /api/saved_objects/{type}/{id}', () => {
  const savedObjectsClient = { delete: _sinon2.default.stub() };
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

    server.route((0, _delete.createDeleteRoute)(prereqs));
  });

  afterEach(() => {
    savedObjectsClient.delete.reset();
  });

  it('formats successful response', async () => {
    const request = {
      method: 'DELETE',
      url: '/api/saved_objects/index-pattern/logstash-*'
    };
    const clientResponse = true;

    savedObjectsClient.delete.returns(Promise.resolve(clientResponse));

    const { payload, statusCode } = await server.inject(request);
    const response = JSON.parse(payload);

    expect(statusCode).toBe(200);
    expect(response).toEqual(clientResponse);
  });

  it('calls upon savedObjectClient.delete', async () => {
    const request = {
      method: 'DELETE',
      url: '/api/saved_objects/index-pattern/logstash-*'
    };

    await server.inject(request);
    expect(savedObjectsClient.delete.calledOnce).toBe(true);

    const args = savedObjectsClient.delete.getCall(0).args;
    expect(args).toEqual(['index-pattern', 'logstash-*']);
  });
});