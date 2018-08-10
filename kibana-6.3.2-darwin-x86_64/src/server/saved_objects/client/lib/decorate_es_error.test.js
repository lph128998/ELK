'use strict';

var _elasticsearch = require('elasticsearch');

var _decorate_es_error = require('./decorate_es_error');

var _errors = require('./errors');

describe('savedObjectsClient/decorateEsError', () => {
  it('always returns the same error it receives', () => {
    const error = new Error();
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
  });

  it('makes es.ConnectionFault a SavedObjectsClient/EsUnavailable error', () => {
    const error = new _elasticsearch.errors.ConnectionFault();
    expect((0, _errors.isEsUnavailableError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isEsUnavailableError)(error)).toBe(true);
  });

  it('makes es.ServiceUnavailable a SavedObjectsClient/EsUnavailable error', () => {
    const error = new _elasticsearch.errors.ServiceUnavailable();
    expect((0, _errors.isEsUnavailableError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isEsUnavailableError)(error)).toBe(true);
  });

  it('makes es.NoConnections a SavedObjectsClient/EsUnavailable error', () => {
    const error = new _elasticsearch.errors.NoConnections();
    expect((0, _errors.isEsUnavailableError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isEsUnavailableError)(error)).toBe(true);
  });

  it('makes es.RequestTimeout a SavedObjectsClient/EsUnavailable error', () => {
    const error = new _elasticsearch.errors.RequestTimeout();
    expect((0, _errors.isEsUnavailableError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isEsUnavailableError)(error)).toBe(true);
  });

  it('makes es.Conflict a SavedObjectsClient/Conflict error', () => {
    const error = new _elasticsearch.errors.Conflict();
    expect((0, _errors.isConflictError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isConflictError)(error)).toBe(true);
  });

  it('makes es.AuthenticationException a SavedObjectsClient/NotAuthorized error', () => {
    const error = new _elasticsearch.errors.AuthenticationException();
    expect((0, _errors.isNotAuthorizedError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isNotAuthorizedError)(error)).toBe(true);
  });

  it('makes es.Forbidden a SavedObjectsClient/Forbidden error', () => {
    const error = new _elasticsearch.errors.Forbidden();
    expect((0, _errors.isForbiddenError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isForbiddenError)(error)).toBe(true);
  });

  it('discards es.NotFound errors and returns a generic NotFound error', () => {
    const error = new _elasticsearch.errors.NotFound();
    expect((0, _errors.isNotFoundError)(error)).toBe(false);
    const genericError = (0, _decorate_es_error.decorateEsError)(error);
    expect(genericError).not.toBe(error);
    expect((0, _errors.isNotFoundError)(error)).toBe(false);
    expect((0, _errors.isNotFoundError)(genericError)).toBe(true);
  });

  it('makes es.BadRequest a SavedObjectsClient/BadRequest error', () => {
    const error = new _elasticsearch.errors.BadRequest();
    expect((0, _errors.isBadRequestError)(error)).toBe(false);
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect((0, _errors.isBadRequestError)(error)).toBe(true);
  });

  it('returns other errors as Boom errors', () => {
    const error = new Error();
    expect(error).not.toHaveProperty('isBoom');
    expect((0, _decorate_es_error.decorateEsError)(error)).toBe(error);
    expect(error).toHaveProperty('isBoom');
  });
});