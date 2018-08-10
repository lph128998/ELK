'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _call_plugin_hook = require('./call_plugin_hook');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('server/plugins/callPluginHook', () => {
  it('should call in correct order based on requirements', async () => {
    const plugins = [{
      id: 'foo',
      init: _sinon2.default.spy(),
      preInit: _sinon2.default.spy(),
      requiredIds: ['bar', 'baz']
    }, {
      id: 'bar',
      init: _sinon2.default.spy(),
      preInit: _sinon2.default.spy(),
      requiredIds: []
    }, {
      id: 'baz',
      init: _sinon2.default.spy(),
      preInit: _sinon2.default.spy(),
      requiredIds: ['bar']
    }];

    await (0, _call_plugin_hook.callPluginHook)('init', plugins, 'foo', []);
    const [foo, bar, baz] = plugins;
    _sinon2.default.assert.calledOnce(foo.init);
    _sinon2.default.assert.calledTwice(bar.init);
    _sinon2.default.assert.calledOnce(baz.init);
    _sinon2.default.assert.callOrder(bar.init, baz.init, foo.init);
  });

  it('throws meaningful error when required plugin is missing', async () => {
    const plugins = [{
      id: 'foo',
      init: _sinon2.default.spy(),
      preInit: _sinon2.default.spy(),
      requiredIds: ['bar']
    }];

    try {
      await (0, _call_plugin_hook.callPluginHook)('init', plugins, 'foo', []);
      throw new Error('expected callPluginHook to throw');
    } catch (error) {
      expect(error.message).toContain('"bar" for plugin "foo"');
    }
  });

  it('throws meaningful error when dependencies are circular', async () => {
    const plugins = [{
      id: 'foo',
      init: _sinon2.default.spy(),
      preInit: _sinon2.default.spy(),
      requiredIds: ['bar']
    }, {
      id: 'bar',
      init: _sinon2.default.spy(),
      preInit: _sinon2.default.spy(),
      requiredIds: ['baz']
    }, {
      id: 'baz',
      init: _sinon2.default.spy(),
      preInit: _sinon2.default.spy(),
      requiredIds: ['foo']
    }];

    try {
      await (0, _call_plugin_hook.callPluginHook)('init', plugins, 'foo', []);
      throw new Error('expected callPluginHook to throw');
    } catch (error) {
      expect(error.message).toContain('foo -> bar -> baz -> foo');
    }
  });
});