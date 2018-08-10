'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _lodash = require('lodash');

var _es_api = require('./es_api');

var callIndexAliasApiNS = _interopRequireWildcard(_es_api);

var _time_pattern_to_wildcard = require('./time_pattern_to_wildcard');

var timePatternToWildcardNS = _interopRequireWildcard(_time_pattern_to_wildcard);

var _resolve_time_pattern = require('./resolve_time_pattern');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TIME_PATTERN = '[logs-]dddd-YYYY.w'; /* eslint import/no-duplicates: 0 */


describe('server/index_patterns/service/lib/resolve_time_pattern', () => {
  let sandbox;
  beforeEach(() => sandbox = _sinon2.default.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('resolveTimePattern()', () => {
    describe('pre request', () => {
      it('uses callIndexAliasApi() fn', async () => {
        sandbox.stub(callIndexAliasApiNS, 'callIndexAliasApi').returns({});
        await (0, _resolve_time_pattern.resolveTimePattern)(_lodash.noop, TIME_PATTERN);
        _sinon2.default.assert.calledOnce(_es_api.callIndexAliasApi);
      });

      it('converts the time pattern to a wildcard with timePatternToWildcard', async () => {
        const timePattern = {};
        const wildcard = {};

        sandbox.stub(timePatternToWildcardNS, 'timePatternToWildcard').returns(wildcard);

        await (0, _resolve_time_pattern.resolveTimePattern)(_lodash.noop, timePattern);
        _sinon2.default.assert.calledOnce(_time_pattern_to_wildcard.timePatternToWildcard);
        expect(_time_pattern_to_wildcard.timePatternToWildcard.firstCall.args).toEqual([timePattern]);
      });

      it('passes the converted wildcard as the index to callIndexAliasApi()', async () => {
        const timePattern = {};
        const wildcard = {};

        sandbox.stub(callIndexAliasApiNS, 'callIndexAliasApi').returns({});
        sandbox.stub(timePatternToWildcardNS, 'timePatternToWildcard').returns(wildcard);

        await (0, _resolve_time_pattern.resolveTimePattern)(_lodash.noop, timePattern);
        _sinon2.default.assert.calledOnce(_es_api.callIndexAliasApi);
        expect(_es_api.callIndexAliasApi.firstCall.args[1]).toBe(wildcard);
      });
    });

    describe('read response', () => {
      it('returns all aliases names in result.all, ordered by time desc', async () => {
        sandbox.stub(callIndexAliasApiNS, 'callIndexAliasApi').returns({
          'logs-2016.2': {},
          'logs-Saturday-2017.1': {},
          'logs-2016.1': {},
          'logs-Sunday-2017.1': {},
          'logs-2015': {},
          'logs-2016.3': {},
          'logs-Friday-2017.1': {}
        });

        const resp = await (0, _resolve_time_pattern.resolveTimePattern)(_lodash.noop, TIME_PATTERN);
        expect(resp).toHaveProperty('all');
        expect(resp.all).toEqual(['logs-Saturday-2017.1', 'logs-Friday-2017.1', 'logs-Sunday-2017.1', 'logs-2016.3', 'logs-2016.2', 'logs-2016.1', 'logs-2015']);
      });

      it('returns all indices matching the time pattern in matches, ordered by time desc', async () => {
        sandbox.stub(callIndexAliasApiNS, 'callIndexAliasApi').returns({
          'logs-2016.2': {},
          'logs-Saturday-2017.1': {},
          'logs-2016.1': {},
          'logs-Sunday-2017.1': {},
          'logs-2015': {},
          'logs-2016.3': {},
          'logs-Friday-2017.1': {}
        });

        const resp = await (0, _resolve_time_pattern.resolveTimePattern)(_lodash.noop, TIME_PATTERN);
        expect(resp).toHaveProperty('matches');
        expect(resp.matches).toEqual(['logs-Saturday-2017.1', 'logs-Friday-2017.1', 'logs-Sunday-2017.1']);
      });
    });
  });
});