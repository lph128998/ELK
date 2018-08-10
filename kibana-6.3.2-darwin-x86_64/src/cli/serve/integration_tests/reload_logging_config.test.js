'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _child_process = require('child_process');

var _fs = require('fs');

var _path = require('path');

var _jsYaml = require('js-yaml');

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var _stripAnsi = require('strip-ansi');

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _read_yaml_config = require('../read_yaml_config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const testConfigFile = follow('__fixtures__/reload_logging_config/kibana.test.yml');
const kibanaPath = follow('../../../../scripts/kibana.js');

function follow(file) {
  return (0, _path.relative)(process.cwd(), (0, _path.resolve)(__dirname, file));
}

function setLoggingJson(enabled) {
  const conf = (0, _read_yaml_config.readYamlConfig)(testConfigFile);
  conf.logging = conf.logging || {};
  conf.logging.json = enabled;

  const yaml = (0, _jsYaml.safeDump)(conf);

  (0, _fs.writeFileSync)(testConfigFile, yaml);
}

const prepareJson = obj => _extends({}, obj, {
  pid: '## PID ##',
  '@timestamp': '## @timestamp ##'
});

const prepareLogLine = str => (0, _stripAnsi2.default)(str.replace(/\[\d{2}:\d{2}:\d{2}.\d{3}\]/, '[## timestamp ##]'));

describe('Server logging configuration', function () {
  let child;
  let isJson;

  beforeEach(() => {
    isJson = true;
    setLoggingJson(true);
  });

  afterEach(() => {
    isJson = true;
    setLoggingJson(true);

    if (child !== undefined) {
      child.kill();
      child = undefined;
    }
  });

  const isWindows = /^win/.test(process.platform);
  if (isWindows) {
    it('SIGHUP is not a feature of Windows.', () => {
      // nothing to do for Windows
    });
  } else {
    it('should be reloadable via SIGHUP process signaling', function (done) {
      expect.assertions(6);

      child = (0, _child_process.spawn)('node', [kibanaPath, '--config', testConfigFile]);

      child.on('error', err => {
        done(new Error(`error in child process while attempting to reload config. ${err.stack || err.message || err}`));
      });

      child.on('exit', code => {
        expect([null, 0]).toContain(code);
        done();
      });

      child.stdout.pipe(_eventStream2.default.split()).pipe(_eventStream2.default.mapSync(line => {
        if (!line) {
          // skip empty lines
          return;
        }

        if (isJson) {
          const data = JSON.parse(line);
          expect(prepareJson(data)).toMatchSnapshot();

          if (data.tags.includes('listening')) {
            switchToPlainTextLog();
          }
        } else if (line.startsWith('{')) {
          // We have told Kibana to stop logging json, but it hasn't completed
          // the switch yet, so we verify the messages that are logged while
          // switching over.

          const data = JSON.parse(line);
          expect(prepareJson(data)).toMatchSnapshot();
        } else {
          // Kibana has successfully stopped logging json, so we verify the
          // log line and kill the server.

          expect(prepareLogLine(line)).toMatchSnapshot();

          child.kill();
          child = undefined;
        }
      }));

      function switchToPlainTextLog() {
        isJson = false;
        setLoggingJson(false);

        // reload logging config
        child.kill('SIGHUP');
      }
    }, 60000);
  }
});