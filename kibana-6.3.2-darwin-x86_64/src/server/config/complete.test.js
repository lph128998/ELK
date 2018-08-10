'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* eslint-disable import/no-duplicates */


var _complete = require('./complete');

var _complete2 = _interopRequireDefault(_complete);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _transform_deprecations = require('./transform_deprecations');

var transformDeprecationsNS = _interopRequireWildcard(_transform_deprecations);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-enable import/no-duplicates */

describe('server/config completeMixin()', function () {
  const sandbox = _sinon2.default.sandbox.create();
  afterEach(() => sandbox.restore());

  const setup = (options = {}) => {
    const {
      settings = {},
      configValues = {},
      disabledPluginSpecs = []
    } = options;

    const server = {
      decorate: _sinon2.default.stub()
    };

    const config = {
      get: _sinon2.default.stub().returns(configValues)
    };

    const kbnServer = {
      settings,
      server,
      config,
      disabledPluginSpecs
    };

    const callCompleteMixin = () => {
      (0, _complete2.default)(kbnServer, server, config);
    };

    return { config, callCompleteMixin, server };
  };

  describe('server decoration', () => {
    it('adds a config() function to the server', () => {
      const { config, callCompleteMixin, server } = setup({
        settings: {},
        configValues: {}
      });

      callCompleteMixin();
      _sinon2.default.assert.calledOnce(server.decorate);
      _sinon2.default.assert.calledWith(server.decorate, 'server', 'config', _sinon2.default.match.func);
      expect(server.decorate.firstCall.args[2]()).toBe(config);
    });
  });

  describe('all settings used', () => {
    it('should not throw', function () {
      const { callCompleteMixin } = setup({
        settings: {
          used: true
        },
        configValues: {
          used: true
        }
      });

      callCompleteMixin();
    });

    describe('more config values than settings', () => {
      it('should not throw', function () {
        const { callCompleteMixin } = setup({
          settings: {
            used: true
          },
          configValues: {
            used: true,
            foo: 'bar'
          }
        });

        callCompleteMixin();
      });
    });
  });

  describe('env setting specified', () => {
    it('should not throw', () => {
      const { callCompleteMixin } = setup({
        settings: {
          env: 'development'
        },
        configValues: {
          env: {
            name: 'development'
          }
        }
      });

      callCompleteMixin();
    });
  });

  describe('settings include non-default array settings', () => {
    it('should not throw', () => {
      const { callCompleteMixin } = setup({
        settings: {
          foo: ['a', 'b']
        },
        configValues: {
          foo: []
        }
      });

      callCompleteMixin();
    });
  });

  describe('some settings unused', () => {
    it('should throw an error', function () {
      const { callCompleteMixin } = setup({
        settings: {
          unused: true
        },
        configValues: {
          used: true
        }
      });

      expect(callCompleteMixin).toThrowError('"unused" setting was not applied');
    });

    describe('error thrown', () => {
      it('has correct code, processExitCode, and message', () => {
        expect.assertions(3);

        const { callCompleteMixin } = setup({
          settings: {
            unused: true,
            foo: 'bar',
            namespace: {
              with: {
                sub: {
                  keys: true
                }
              }
            }
          }
        });

        try {
          callCompleteMixin();
        } catch (error) {
          expect(error).toHaveProperty('code', 'InvalidConfig');
          expect(error).toHaveProperty('processExitCode', 64);
          expect(error.message).toMatch('"unused", "foo", and "namespace.with.sub.keys"');
        }
      });
    });
  });

  describe('deprecation support', () => {
    it('should transform settings when determining what is unused', function () {
      sandbox.spy(transformDeprecationsNS, 'transformDeprecations');

      const settings = {
        foo: 1
      };

      const { callCompleteMixin } = setup({
        settings,
        configValues: _extends({}, settings)
      });

      callCompleteMixin();
      _sinon2.default.assert.calledOnce(_transform_deprecations.transformDeprecations);
      _sinon2.default.assert.calledWithExactly(_transform_deprecations.transformDeprecations, settings);
    });

    it('should use transformed settings when considering what is used', function () {
      sandbox.stub(transformDeprecationsNS, 'transformDeprecations', settings => {
        settings.bar = settings.foo;
        delete settings.foo;
        return settings;
      });

      const { callCompleteMixin } = setup({
        settings: {
          foo: 1
        },
        configValues: {
          bar: 1
        }
      });

      callCompleteMixin();
      _sinon2.default.assert.calledOnce(_transform_deprecations.transformDeprecations);
    });
  });

  describe('disabled plugins', () => {
    it('ignores config for plugins that are disabled', () => {
      const { callCompleteMixin } = setup({
        settings: {
          foo: {
            bar: {
              unused: true
            }
          }
        },
        disabledPluginSpecs: [{
          id: 'foo',
          getConfigPrefix: () => 'foo.bar'
        }],
        configValues: {}
      });

      expect(callCompleteMixin).not.toThrowError();
    });
  });
});