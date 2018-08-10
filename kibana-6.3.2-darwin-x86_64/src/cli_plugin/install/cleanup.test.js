'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _cleanup = require('./cleanup');

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('kibana cli', function () {

  describe('plugin installer', function () {

    describe('pluginCleaner', function () {
      const settings = {
        workingPath: 'dummy'
      };

      describe('cleanPrevious', function () {
        let errorStub;
        let logger;

        beforeEach(function () {
          errorStub = _sinon2.default.stub();
          logger = new _logger2.default(settings);
          _sinon2.default.stub(logger, 'log');
          _sinon2.default.stub(logger, 'error');
        });

        afterEach(function () {
          logger.log.restore();
          logger.error.restore();
          _fs2.default.statSync.restore();
          _rimraf2.default.sync.restore();
        });

        it('should resolve if the working path does not exist', function () {
          _sinon2.default.stub(_rimraf2.default, 'sync');
          _sinon2.default.stub(_fs2.default, 'statSync', function () {
            const error = new Error('ENOENT');
            error.code = 'ENOENT';
            throw error;
          });

          return (0, _cleanup.cleanPrevious)(settings, logger).catch(errorStub).then(function () {
            expect(errorStub.called).toBe(false);
          });
        });

        it('should rethrow any exception except ENOENT from fs.statSync', function () {
          _sinon2.default.stub(_rimraf2.default, 'sync');
          _sinon2.default.stub(_fs2.default, 'statSync', function () {
            const error = new Error('An Unhandled Error');
            throw error;
          });

          errorStub = _sinon2.default.stub();
          return (0, _cleanup.cleanPrevious)(settings, logger).catch(errorStub).then(function () {
            expect(errorStub.called).toBe(true);
          });
        });

        it('should log a message if there was a working directory', function () {
          _sinon2.default.stub(_rimraf2.default, 'sync');
          _sinon2.default.stub(_fs2.default, 'statSync');

          return (0, _cleanup.cleanPrevious)(settings, logger).catch(errorStub).then(function () {
            expect(logger.log.calledWith('Found previous install attempt. Deleting...')).toBe(true);
          });
        });

        it('should rethrow any exception from rimraf.sync', function () {
          _sinon2.default.stub(_fs2.default, 'statSync');
          _sinon2.default.stub(_rimraf2.default, 'sync', function () {
            throw new Error('I am an error thrown by rimraf');
          });

          errorStub = _sinon2.default.stub();
          return (0, _cleanup.cleanPrevious)(settings, logger).catch(errorStub).then(function () {
            expect(errorStub.called).toBe(true);
          });
        });

        it('should resolve if the working path is deleted', function () {
          _sinon2.default.stub(_rimraf2.default, 'sync');
          _sinon2.default.stub(_fs2.default, 'statSync');

          return (0, _cleanup.cleanPrevious)(settings, logger).catch(errorStub).then(function () {
            expect(errorStub.called).toBe(false);
          });
        });
      });

      describe('cleanArtifacts', function () {
        beforeEach(function () {});

        afterEach(function () {
          _rimraf2.default.sync.restore();
        });

        it('should attempt to delete the working directory', function () {
          _sinon2.default.stub(_rimraf2.default, 'sync');

          (0, _cleanup.cleanArtifacts)(settings);
          expect(_rimraf2.default.sync.calledWith(settings.workingPath)).toBe(true);
        });

        it('should swallow any errors thrown by rimraf.sync', function () {
          _sinon2.default.stub(_rimraf2.default, 'sync', function () {
            throw new Error('Something bad happened.');
          });

          expect(() => (0, _cleanup.cleanArtifacts)(settings)).not.toThrow();
        });
      });
    });
  });
});