'use strict';

var _wrap_auth_config = require('./wrap_auth_config');

describe('Status wrapAuthConfig', () => {
  let options;

  beforeEach(() => {
    options = {
      method: 'GET',
      path: '/status',
      handler: function (request, reply) {
        return reply();
      }
    };
  });

  it('should return a function', () => {
    expect(typeof (0, _wrap_auth_config.wrapAuthConfig)()).toBe('function');
    expect(typeof (0, _wrap_auth_config.wrapAuthConfig)(true)).toBe('function');
    expect(typeof (0, _wrap_auth_config.wrapAuthConfig)(false)).toBe('function');
  });

  it('should not add auth config by default', () => {
    const wrapAuth = (0, _wrap_auth_config.wrapAuthConfig)();
    const wrapped = wrapAuth(options);
    expect(wrapped).not.toHaveProperty('config');
  });

  it('should not add auth config if allowAnonymous is false', () => {
    const wrapAuth = (0, _wrap_auth_config.wrapAuthConfig)(false);
    const wrapped = wrapAuth(options);
    expect(wrapped).not.toHaveProperty('config');
  });

  it('should add auth config if allowAnonymous is true', () => {
    const wrapAuth = (0, _wrap_auth_config.wrapAuthConfig)(true);
    const wrapped = wrapAuth(options);
    expect(wrapped).toHaveProperty('config');
    expect(wrapped.config).toHaveProperty('auth');
    expect(wrapped.config.auth).toBe(false);
  });
});