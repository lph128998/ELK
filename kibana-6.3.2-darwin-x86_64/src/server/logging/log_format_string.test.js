'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utils = require('../../utils');

var _log_format_string = require('./log_format_string');

var _log_format_string2 = _interopRequireDefault(_log_format_string);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const time = +(0, _moment2.default)('2010-01-01T05:15:59Z', _moment2.default.ISO_8601);

const makeEvent = () => ({
  event: 'log',
  timestamp: time,
  tags: ['tag'],
  pid: 1,
  data: 'my log message'
});

describe('KbnLoggerStringFormat', () => {
  it('logs in UTC when useUTC is true', async () => {
    const format = new _log_format_string2.default({
      useUTC: true
    });

    const result = await (0, _utils.createPromiseFromStreams)([(0, _utils.createListStream)([makeEvent()]), format]);

    expect(String(result)).toContain(_moment2.default.utc(time).format('HH:mm:ss.SSS'));
  });

  it('logs in local timezone when useUTC is false', async () => {
    const format = new _log_format_string2.default({
      useUTC: false
    });

    const result = await (0, _utils.createPromiseFromStreams)([(0, _utils.createListStream)([makeEvent()]), format]);

    expect(String(result)).toContain((0, _moment2.default)(time).format('HH:mm:ss.SSS'));
  });
});