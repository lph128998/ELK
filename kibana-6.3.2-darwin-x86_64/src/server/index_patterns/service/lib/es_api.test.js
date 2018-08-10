'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _errors = require('./errors');

var convertEsErrorNS = _interopRequireWildcard(_errors);

var _es_api = require('./es_api');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint import/no-duplicates: 0 */
describe('server/index_patterns/service/lib/es_api', () => {
  describe('#callIndexAliasApi()', () => {
    let sandbox;
    beforeEach(() => sandbox = _sinon2.default.sandbox.create());
    afterEach(() => sandbox.restore());

    it('calls indices.getAlias() via callCluster', async () => {
      const callCluster = _sinon2.default.stub();
      await (0, _es_api.callIndexAliasApi)(callCluster);
      _sinon2.default.assert.calledOnce(callCluster);
      _sinon2.default.assert.calledWith(callCluster, 'indices.getAlias');
    });

    it('passes indices directly to es api', async () => {
      const football = {};
      const callCluster = _sinon2.default.stub();
      await (0, _es_api.callIndexAliasApi)(callCluster, football);
      _sinon2.default.assert.calledOnce(callCluster);
      expect(callCluster.args[0][1].index).toBe(football);
    });

    it('returns the es response directly', async () => {
      const football = {};
      const callCluster = _sinon2.default.stub().returns(football);
      const resp = await (0, _es_api.callIndexAliasApi)(callCluster);
      _sinon2.default.assert.calledOnce(callCluster);
      expect(resp).toBe(football);
    });

    it('sets ignoreUnavailable and allowNoIndices params', async () => {
      const callCluster = _sinon2.default.stub();
      await (0, _es_api.callIndexAliasApi)(callCluster);
      _sinon2.default.assert.calledOnce(callCluster);

      const passedOpts = callCluster.args[0][1];
      expect(passedOpts).toHaveProperty('ignoreUnavailable', true);
      expect(passedOpts).toHaveProperty('allowNoIndices', false);
    });

    it('handles errors with convertEsError()', async () => {
      const indices = [];
      const esError = new Error('esError');
      const convertedError = new Error('convertedError');

      sandbox.stub(convertEsErrorNS, 'convertEsError', () => {
        throw convertedError;
      });
      const callCluster = _sinon2.default.spy(async () => {
        throw esError;
      });
      try {
        await (0, _es_api.callIndexAliasApi)(callCluster, indices);
        throw new Error('expected callIndexAliasApi() to throw');
      } catch (error) {
        expect(error).toBe(convertedError);
        _sinon2.default.assert.calledOnce(_errors.convertEsError);
        expect(_errors.convertEsError.args[0][0]).toBe(indices);
        expect(_errors.convertEsError.args[0][1]).toBe(esError);
      }
    });
  });

  describe('#callFieldCapsApi()', () => {
    let sandbox;
    beforeEach(() => sandbox = _sinon2.default.sandbox.create());
    afterEach(() => sandbox.restore());

    it('calls fieldCaps() via callCluster', async () => {
      const callCluster = _sinon2.default.stub();
      await (0, _es_api.callFieldCapsApi)(callCluster);
      _sinon2.default.assert.calledOnce(callCluster);
      _sinon2.default.assert.calledWith(callCluster, 'fieldCaps');
    });

    it('passes indices directly to es api', async () => {
      const football = {};
      const callCluster = _sinon2.default.stub();
      await (0, _es_api.callFieldCapsApi)(callCluster, football);
      _sinon2.default.assert.calledOnce(callCluster);
      expect(callCluster.args[0][1].index).toBe(football);
    });

    it('returns the es response directly', async () => {
      const football = {};
      const callCluster = _sinon2.default.stub().returns(football);
      const resp = await (0, _es_api.callFieldCapsApi)(callCluster);
      _sinon2.default.assert.calledOnce(callCluster);
      expect(resp).toBe(football);
    });

    it('sets ignoreUnavailable, allowNoIndices, and fields params', async () => {
      const callCluster = _sinon2.default.stub();
      await (0, _es_api.callFieldCapsApi)(callCluster);
      _sinon2.default.assert.calledOnce(callCluster);

      const passedOpts = callCluster.args[0][1];
      expect(passedOpts).toHaveProperty('fields', '*');
      expect(passedOpts).toHaveProperty('ignoreUnavailable', true);
      expect(passedOpts).toHaveProperty('allowNoIndices', false);
    });

    it('handles errors with convertEsError()', async () => {
      const indices = [];
      const esError = new Error('esError');
      const convertedError = new Error('convertedError');

      sandbox.stub(convertEsErrorNS, 'convertEsError', () => {
        throw convertedError;
      });
      const callCluster = _sinon2.default.spy(async () => {
        throw esError;
      });
      try {
        await (0, _es_api.callFieldCapsApi)(callCluster, indices);
        throw new Error('expected callFieldCapsApi() to throw');
      } catch (error) {
        expect(error).toBe(convertedError);
        _sinon2.default.assert.calledOnce(_errors.convertEsError);
        expect(_errors.convertEsError.args[0][0]).toBe(indices);
        expect(_errors.convertEsError.args[0][1]).toBe(esError);
      }
    });
  });
});