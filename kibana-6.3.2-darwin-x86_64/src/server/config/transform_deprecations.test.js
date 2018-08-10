'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _transform_deprecations = require('./transform_deprecations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('server/config', function () {
  describe('transformDeprecations', function () {
    describe('server.ssl.enabled', function () {
      it('sets enabled to true when certificate and key are set', function () {
        const settings = {
          server: {
            ssl: {
              certificate: '/cert.crt',
              key: '/key.key'
            }
          }
        };

        const result = (0, _transform_deprecations.transformDeprecations)(settings);
        expect(result.server.ssl.enabled).toBe(true);
      });

      it('logs a message when automatically setting enabled to true', function () {
        const settings = {
          server: {
            ssl: {
              certificate: '/cert.crt',
              key: '/key.key'
            }
          }
        };

        const log = _sinon2.default.spy();
        (0, _transform_deprecations.transformDeprecations)(settings, log);
        expect(log.calledOnce).toBe(true);
      });

      it(`doesn't set enabled when key and cert aren't set`, function () {
        const settings = {
          server: {
            ssl: {}
          }
        };

        const result = (0, _transform_deprecations.transformDeprecations)(settings);
        expect(result.server.ssl.enabled).toBe(undefined);
      });

      it(`doesn't log a message when not automatically setting enabled`, function () {
        const settings = {
          server: {
            ssl: {}
          }
        };

        const log = _sinon2.default.spy();
        (0, _transform_deprecations.transformDeprecations)(settings, log);
        expect(log.called).toBe(false);
      });
    });

    describe('savedObjects.indexCheckTimeout', () => {
      it('removes the indexCheckTimeout and savedObjects properties', () => {
        const settings = {
          savedObjects: {
            indexCheckTimeout: 123
          }
        };

        expect((0, _transform_deprecations.transformDeprecations)(settings)).toEqual({});
      });

      it('keeps the savedObjects property if it has other keys', () => {
        const settings = {
          savedObjects: {
            indexCheckTimeout: 123,
            foo: 'bar'
          }
        };

        expect((0, _transform_deprecations.transformDeprecations)(settings)).toEqual({
          savedObjects: {
            foo: 'bar'
          }
        });
      });

      it('logs that the setting is no longer necessary', () => {
        const settings = {
          savedObjects: {
            indexCheckTimeout: 123
          }
        };

        const log = _sinon2.default.spy();
        (0, _transform_deprecations.transformDeprecations)(settings, log);
        _sinon2.default.assert.calledOnce(log);
        _sinon2.default.assert.calledWithExactly(log, _sinon2.default.match('savedObjects.indexCheckTimeout'));
      });
    });
  });
});