'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _child_process = require('child_process');

var _path = require('path');

const ROOT_DIR = (0, _path.resolve)(__dirname, '../../../../');
const INVALID_CONFIG_PATH = (0, _path.resolve)(__dirname, '__fixtures__/invalid_config.yml');

describe('cli invalid config support', function () {
  it('exits with statusCode 64 and logs a single line when config is invalid', function () {
    const { error, status, stdout } = (0, _child_process.spawnSync)(process.execPath, ['src/cli', '--config', INVALID_CONFIG_PATH], {
      cwd: ROOT_DIR
    });

    const logLines = stdout.toString('utf8').split('\n').filter(Boolean).map(JSON.parse).map(obj => _extends({}, obj, {
      pid: '## PID ##',
      '@timestamp': '## @timestamp ##'
    }));

    expect(error).toBe(undefined);
    expect(status).toBe(64);
    expect(logLines).toMatchSnapshot();
  }, 20 * 1000);
});