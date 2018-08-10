'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _lodash = require('lodash');

var _field_capabilities = require('../field_capabilities');

var _es_api = require('../es_api');

var callFieldCapsApiNS = _interopRequireWildcard(_es_api);

var _field_caps_response = require('./field_caps_response');

var readFieldCapsResponseNS = _interopRequireWildcard(_field_caps_response);

var _overrides = require('./overrides');

var mergeOverridesNS = _interopRequireWildcard(_overrides);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('index_patterns/field_capabilities/field_capabilities', () => {
  let sandbox;
  beforeEach(() => sandbox = _sinon2.default.sandbox.create());
  afterEach(() => sandbox.restore());

  const footballs = [{ 'could be aything': true }, { 'used to verify that values are directly passed through': true }];

  // assert that the stub was called with the exact `args`, using === matching
  const calledWithExactly = (stub, args, matcher = _sinon2.default.match.same) => {
    _sinon2.default.assert.calledWithExactly(stub, ...args.map(arg => matcher(arg)));
  };

  const stubDeps = (options = {}) => {
    const {
      esResponse = {},
      fieldsFromFieldCaps = [],
      mergeOverrides = _lodash.identity
    } = options;

    sandbox.stub(callFieldCapsApiNS, 'callFieldCapsApi', async () => esResponse);
    sandbox.stub(readFieldCapsResponseNS, 'readFieldCapsResponse', () => fieldsFromFieldCaps);
    sandbox.stub(mergeOverridesNS, 'mergeOverrides', mergeOverrides);
  };

  describe('calls `callFieldCapsApi()`', () => {
    it('passes exact `callCluster` and `indices` args through', async () => {
      stubDeps();

      await (0, _field_capabilities.getFieldCapabilities)(footballs[0], footballs[1]);
      _sinon2.default.assert.calledOnce(_es_api.callFieldCapsApi);
      calledWithExactly(_es_api.callFieldCapsApi, [footballs[0], footballs[1]]);
    });
  });

  describe('calls `readFieldCapsResponse`', () => {
    it('passes exact es response', async () => {
      stubDeps({
        esResponse: footballs[0]
      });

      await (0, _field_capabilities.getFieldCapabilities)();
      _sinon2.default.assert.calledOnce(_field_caps_response.readFieldCapsResponse);
      calledWithExactly(_field_caps_response.readFieldCapsResponse, [footballs[0]]);
    });
  });

  describe('response order', () => {
    it('always returns fields in alphabetical order', async () => {
      const letters = 'ambcdfjopngihkel'.split('');
      const sortedLetters = (0, _lodash.sortBy)(letters);

      stubDeps({
        fieldsFromFieldCaps: (0, _lodash.shuffle)(letters.map(name => ({ name })))
      });

      const fieldNames = (await (0, _field_capabilities.getFieldCapabilities)()).map(field => field.name);
      expect(fieldNames).toEqual(sortedLetters);
    });
  });

  describe('metaFields', () => {
    it('ensures there is a response for each metaField', async () => {
      stubDeps({
        fieldsFromFieldCaps: [{ name: 'foo' }, { name: 'bar' }]
      });

      const resp = await (0, _field_capabilities.getFieldCapabilities)(undefined, undefined, ['meta1', 'meta2']);
      expect(resp).toHaveLength(4);
      expect(resp.map(field => field.name)).toEqual(['bar', 'foo', 'meta1', 'meta2']);
    });
  });

  describe('defaults', () => {
    const properties = ['name', 'type', 'searchable', 'aggregatable', 'readFromDocValues'];

    const createField = () => ({
      name: footballs[0],
      type: footballs[0],
      searchable: footballs[0],
      aggregatable: footballs[0],
      readFromDocValues: footballs[0]
    });

    describe('ensures that every field has property:', () => {
      properties.forEach(property => {
        it(property, async () => {
          const field = createField();
          delete field[property];

          stubDeps({
            fieldsFromFieldCaps: [field]
          });

          const resp = await (0, _field_capabilities.getFieldCapabilities)();
          expect(resp).toHaveLength(1);
          expect(resp[0]).toHaveProperty(property);
          expect(resp[0][property]).not.toBe(footballs[0]);

          // ensure field object was not mutated
          expect(field).not.toHaveProperty(property);
          Object.keys(field).forEach(key => {
            // ensure response field has original values from field
            expect(resp[0][key]).toBe(footballs[0]);
          });
        });
      });
    });
  });

  describe('overrides', () => {
    it('passes each field to `mergeOverrides()`', async () => {
      const fieldsFromFieldCaps = [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }];

      stubDeps({ fieldsFromFieldCaps });

      _sinon2.default.assert.notCalled(_overrides.mergeOverrides);
      await (0, _field_capabilities.getFieldCapabilities)();
      _sinon2.default.assert.calledThrice(_overrides.mergeOverrides);

      expect(_overrides.mergeOverrides.args[0][0]).toHaveProperty('name', 'foo');
      expect(_overrides.mergeOverrides.args[1][0]).toHaveProperty('name', 'bar');
      expect(_overrides.mergeOverrides.args[2][0]).toHaveProperty('name', 'baz');
    });

    it('replaces field with return value', async () => {
      const fieldsFromFieldCaps = [{ name: 'foo', bar: 1 }, { name: 'baz', box: 2 }];

      stubDeps({
        fieldsFromFieldCaps,
        mergeOverrides() {
          return { notFieldAnymore: 1 };
        }
      });

      expect((await (0, _field_capabilities.getFieldCapabilities)())).toEqual([{ notFieldAnymore: 1 }, { notFieldAnymore: 1 }]);
    });
  });
}); /* eslint import/no-duplicates: 0 */