'use strict';

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('savedObjectsClient/errorTypes', () => {
  describe('BadRequest error', () => {
    describe('decorateBadRequestError', () => {
      it('returns original object', () => {
        const error = new Error();
        expect((0, _errors.decorateBadRequestError)(error)).toBe(error);
      });

      it('makes the error identifiable as a BadRequest error', () => {
        const error = new Error();
        expect((0, _errors.isBadRequestError)(error)).toBe(false);
        (0, _errors.decorateBadRequestError)(error);
        expect((0, _errors.isBadRequestError)(error)).toBe(true);
      });

      it('adds boom properties', () => {
        const error = (0, _errors.decorateBadRequestError)(new Error());
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(400);
      });

      it('preserves boom properties of input', () => {
        const error = _boom2.default.notFound();
        (0, _errors.decorateBadRequestError)(error);
        expect(error.output.statusCode).toBe(404);
      });

      describe('error.output', () => {
        it('defaults to message of erorr', () => {
          const error = (0, _errors.decorateBadRequestError)(new Error('foobar'));
          expect(error.output.payload).toHaveProperty('message', 'foobar');
        });
        it('prefixes message with passed reason', () => {
          const error = (0, _errors.decorateBadRequestError)(new Error('foobar'), 'biz');
          expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
        });
        it('sets statusCode to 400', () => {
          const error = (0, _errors.decorateBadRequestError)(new Error('foo'));
          expect(error.output).toHaveProperty('statusCode', 400);
        });
      });
    });
  });
  describe('NotAuthorized error', () => {
    describe('decorateNotAuthorizedError', () => {
      it('returns original object', () => {
        const error = new Error();
        expect((0, _errors.decorateNotAuthorizedError)(error)).toBe(error);
      });

      it('makes the error identifiable as a NotAuthorized error', () => {
        const error = new Error();
        expect((0, _errors.isNotAuthorizedError)(error)).toBe(false);
        (0, _errors.decorateNotAuthorizedError)(error);
        expect((0, _errors.isNotAuthorizedError)(error)).toBe(true);
      });

      it('adds boom properties', () => {
        const error = (0, _errors.decorateNotAuthorizedError)(new Error());
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(401);
      });

      it('preserves boom properties of input', () => {
        const error = _boom2.default.notFound();
        (0, _errors.decorateNotAuthorizedError)(error);
        expect(error.output.statusCode).toBe(404);
      });

      describe('error.output', () => {
        it('defaults to message of erorr', () => {
          const error = (0, _errors.decorateNotAuthorizedError)(new Error('foobar'));
          expect(error.output.payload).toHaveProperty('message', 'foobar');
        });
        it('prefixes message with passed reason', () => {
          const error = (0, _errors.decorateNotAuthorizedError)(new Error('foobar'), 'biz');
          expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
        });
        it('sets statusCode to 401', () => {
          const error = (0, _errors.decorateNotAuthorizedError)(new Error('foo'));
          expect(error.output).toHaveProperty('statusCode', 401);
        });
      });
    });
  });
  describe('Forbidden error', () => {
    describe('decorateForbiddenError', () => {
      it('returns original object', () => {
        const error = new Error();
        expect((0, _errors.decorateForbiddenError)(error)).toBe(error);
      });

      it('makes the error identifiable as a Forbidden error', () => {
        const error = new Error();
        expect((0, _errors.isForbiddenError)(error)).toBe(false);
        (0, _errors.decorateForbiddenError)(error);
        expect((0, _errors.isForbiddenError)(error)).toBe(true);
      });

      it('adds boom properties', () => {
        const error = (0, _errors.decorateForbiddenError)(new Error());
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(403);
      });

      it('preserves boom properties of input', () => {
        const error = _boom2.default.notFound();
        (0, _errors.decorateForbiddenError)(error);
        expect(error.output.statusCode).toBe(404);
      });

      describe('error.output', () => {
        it('defaults to message of erorr', () => {
          const error = (0, _errors.decorateForbiddenError)(new Error('foobar'));
          expect(error.output.payload).toHaveProperty('message', 'foobar');
        });
        it('prefixes message with passed reason', () => {
          const error = (0, _errors.decorateForbiddenError)(new Error('foobar'), 'biz');
          expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
        });
        it('sets statusCode to 403', () => {
          const error = (0, _errors.decorateForbiddenError)(new Error('foo'));
          expect(error.output).toHaveProperty('statusCode', 403);
        });
      });
    });
  });
  describe('NotFound error', () => {
    describe('createGenericNotFoundError', () => {
      it('makes an error identifiable as a NotFound error', () => {
        const error = (0, _errors.createGenericNotFoundError)();
        expect((0, _errors.isNotFoundError)(error)).toBe(true);
      });

      it('is a boom error, has boom properties', () => {
        const error = (0, _errors.createGenericNotFoundError)();
        expect(error).toHaveProperty('isBoom');
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(404);
      });

      describe('error.output', () => {
        it('Uses "Not Found" message', () => {
          const error = (0, _errors.createGenericNotFoundError)();
          expect(error.output.payload).toHaveProperty('message', 'Not Found');
        });
        it('sets statusCode to 404', () => {
          const error = (0, _errors.createGenericNotFoundError)();
          expect(error.output).toHaveProperty('statusCode', 404);
        });
      });
    });
  });
  describe('Conflict error', () => {
    describe('decorateConflictError', () => {
      it('returns original object', () => {
        const error = new Error();
        expect((0, _errors.decorateConflictError)(error)).toBe(error);
      });

      it('makes the error identifiable as a Conflict error', () => {
        const error = new Error();
        expect((0, _errors.isConflictError)(error)).toBe(false);
        (0, _errors.decorateConflictError)(error);
        expect((0, _errors.isConflictError)(error)).toBe(true);
      });

      it('adds boom properties', () => {
        const error = (0, _errors.decorateConflictError)(new Error());
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(409);
      });

      it('preserves boom properties of input', () => {
        const error = _boom2.default.notFound();
        (0, _errors.decorateConflictError)(error);
        expect(error.output.statusCode).toBe(404);
      });

      describe('error.output', () => {
        it('defaults to message of erorr', () => {
          const error = (0, _errors.decorateConflictError)(new Error('foobar'));
          expect(error.output.payload).toHaveProperty('message', 'foobar');
        });
        it('prefixes message with passed reason', () => {
          const error = (0, _errors.decorateConflictError)(new Error('foobar'), 'biz');
          expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
        });
        it('sets statusCode to 409', () => {
          const error = (0, _errors.decorateConflictError)(new Error('foo'));
          expect(error.output).toHaveProperty('statusCode', 409);
        });
      });
    });
  });
  describe('EsUnavailable error', () => {
    describe('decorateEsUnavailableError', () => {
      it('returns original object', () => {
        const error = new Error();
        expect((0, _errors.decorateEsUnavailableError)(error)).toBe(error);
      });

      it('makes the error identifiable as a EsUnavailable error', () => {
        const error = new Error();
        expect((0, _errors.isEsUnavailableError)(error)).toBe(false);
        (0, _errors.decorateEsUnavailableError)(error);
        expect((0, _errors.isEsUnavailableError)(error)).toBe(true);
      });

      it('adds boom properties', () => {
        const error = (0, _errors.decorateEsUnavailableError)(new Error());
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(503);
      });

      it('preserves boom properties of input', () => {
        const error = _boom2.default.notFound();
        (0, _errors.decorateEsUnavailableError)(error);
        expect(error.output.statusCode).toBe(404);
      });

      describe('error.output', () => {
        it('defaults to message of erorr', () => {
          const error = (0, _errors.decorateEsUnavailableError)(new Error('foobar'));
          expect(error.output.payload).toHaveProperty('message', 'foobar');
        });
        it('prefixes message with passed reason', () => {
          const error = (0, _errors.decorateEsUnavailableError)(new Error('foobar'), 'biz');
          expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
        });
        it('sets statusCode to 503', () => {
          const error = (0, _errors.decorateEsUnavailableError)(new Error('foo'));
          expect(error.output).toHaveProperty('statusCode', 503);
        });
      });
    });
  });
  describe('General error', () => {
    describe('decorateGeneralError', () => {
      it('returns original object', () => {
        const error = new Error();
        expect((0, _errors.decorateGeneralError)(error)).toBe(error);
      });

      it('adds boom properties', () => {
        const error = (0, _errors.decorateGeneralError)(new Error());
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(500);
      });

      it('preserves boom properties of input', () => {
        const error = _boom2.default.notFound();
        (0, _errors.decorateGeneralError)(error);
        expect(error.output.statusCode).toBe(404);
      });

      describe('error.output', () => {
        it('ignores error message', () => {
          const error = (0, _errors.decorateGeneralError)(new Error('foobar'));
          expect(error.output.payload.message).toMatch(/internal server error/i);
        });
        it('sets statusCode to 500', () => {
          const error = (0, _errors.decorateGeneralError)(new Error('foo'));
          expect(error.output).toHaveProperty('statusCode', 500);
        });
      });
    });
  });

  describe('EsAutoCreateIndex error', () => {
    describe('createEsAutoCreateIndexError', () => {
      it('does not take an error argument', () => {
        const error = new Error();
        expect((0, _errors.createEsAutoCreateIndexError)(error)).not.toBe(error);
      });

      it('returns a new Error', () => {
        expect((0, _errors.createEsAutoCreateIndexError)()).toBeInstanceOf(Error);
      });

      it('makes errors identifiable as EsAutoCreateIndex errors', () => {
        expect((0, _errors.isEsAutoCreateIndexError)((0, _errors.createEsAutoCreateIndexError)())).toBe(true);
      });

      it('returns a boom error', () => {
        const error = (0, _errors.createEsAutoCreateIndexError)();
        expect(error).toHaveProperty('isBoom');
        expect(typeof error.output).toBe('object');
        expect(error.output.statusCode).toBe(503);
      });

      describe('error.output', () => {
        it('uses "Automatic index creation failed" message', () => {
          const error = (0, _errors.createEsAutoCreateIndexError)();
          expect(error.output.payload).toHaveProperty('message', 'Automatic index creation failed');
        });
        it('sets statusCode to 503', () => {
          const error = (0, _errors.createEsAutoCreateIndexError)();
          expect(error.output).toHaveProperty('statusCode', 503);
        });
      });
    });
  });
});