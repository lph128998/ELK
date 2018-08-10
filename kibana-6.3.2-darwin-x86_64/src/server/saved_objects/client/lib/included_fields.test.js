'use strict';

var _included_fields = require('./included_fields');

describe('includedFields', () => {
  it('returns undefined if fields are not provided', () => {
    expect((0, _included_fields.includedFields)()).toBe(undefined);
  });

  it('includes type', () => {
    const fields = (0, _included_fields.includedFields)('config', 'foo');
    expect(fields).toHaveLength(3);
    expect(fields).toContain('type');
  });

  it('accepts field as string', () => {
    const fields = (0, _included_fields.includedFields)('config', 'foo');
    expect(fields).toHaveLength(3);
    expect(fields).toContain('config.foo');
  });

  it('accepts fields as an array', () => {
    const fields = (0, _included_fields.includedFields)('config', ['foo', 'bar']);

    expect(fields).toHaveLength(5);
    expect(fields).toContain('config.foo');
    expect(fields).toContain('config.bar');
  });

  it('uses wildcard when type is not provided', () => {
    const fields = (0, _included_fields.includedFields)(undefined, 'foo');
    expect(fields).toHaveLength(3);
    expect(fields).toContain('*.foo');
  });

  describe('v5 compatibility', () => {
    it('includes legacy field path', () => {
      const fields = (0, _included_fields.includedFields)('config', ['foo', 'bar']);

      expect(fields).toHaveLength(5);
      expect(fields).toContain('foo');
      expect(fields).toContain('bar');
    });
  });
});