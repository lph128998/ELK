'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _search_dsl = require('./search_dsl');

var _query_params = require('./query_params');

var queryParamsNS = _interopRequireWildcard(_query_params);

var _sorting_params = require('./sorting_params');

var sortParamsNS = _interopRequireWildcard(_sorting_params);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getSearchDsl', () => {
  const sandbox = _sinon2.default.sandbox.create();
  afterEach(() => sandbox.restore());

  describe('validation', () => {
    it('throws when sortField is passed without type', () => {
      expect(() => {
        (0, _search_dsl.getSearchDsl)({}, {
          type: undefined,
          sortField: 'title'
        });
      }).toThrowError(/sort without .+ type/);
    });
    it('throws when sortOrder without sortField', () => {
      expect(() => {
        (0, _search_dsl.getSearchDsl)({}, {
          type: 'foo',
          sortOrder: 'desc'
        });
      }).toThrowError(/sortOrder requires a sortField/);
    });
  });

  describe('passes control', () => {
    it('passes (mappings, type, search, searchFields) to getQueryParams', () => {
      const spy = sandbox.spy(queryParamsNS, 'getQueryParams');
      const mappings = { type: { properties: {} } };
      const opts = {
        type: 'foo',
        search: 'bar',
        searchFields: ['baz']
      };

      (0, _search_dsl.getSearchDsl)(mappings, opts);
      _sinon2.default.assert.calledOnce(spy);
      _sinon2.default.assert.calledWithExactly(spy, mappings, opts.type, opts.search, opts.searchFields);
    });

    it('passes (mappings, type, sortField, sortOrder) to getSortingParams', () => {
      const spy = sandbox.stub(sortParamsNS, 'getSortingParams').returns({});
      const mappings = { type: { properties: {} } };
      const opts = {
        type: 'foo',
        sortField: 'bar',
        sortOrder: 'baz'
      };

      (0, _search_dsl.getSearchDsl)(mappings, opts);
      _sinon2.default.assert.calledOnce(spy);
      _sinon2.default.assert.calledWithExactly(spy, mappings, opts.type, opts.sortField, opts.sortOrder);
    });

    it('returns combination of getQueryParams and getSortingParams', () => {
      sandbox.stub(queryParamsNS, 'getQueryParams').returns({ a: 'a' });
      sandbox.stub(sortParamsNS, 'getSortingParams').returns({ b: 'b' });
      expect((0, _search_dsl.getSearchDsl)({})).toEqual({ a: 'a', b: 'b' });
    });
  });
});