'use strict';

var _kbn_server = require('../test_utils/kbn_server');

var kbnTestServer = _interopRequireWildcard(_kbn_server);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const basePath = '/kibana';

describe('Server basePath config', function () {
  let kbnServer;
  beforeAll(async function () {
    kbnServer = kbnTestServer.createServer({
      server: { basePath }
    });
    await kbnServer.ready();
    return kbnServer;
  });

  afterAll(async function () {
    await kbnServer.close();
  });

  it('appends the basePath to root redirect', function (done) {
    const options = {
      url: '/',
      method: 'GET'
    };
    kbnTestServer.makeRequest(kbnServer, options, function (res) {
      try {
        expect(res.payload).toMatch(/defaultRoute = '\/kibana\/app\/kibana'/);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});