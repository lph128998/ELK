'use strict';

var _ = require('./');

var _fs = require('fs');

describe('Default path finder', function () {
  it('should find a kibana.yml', () => {
    const configPath = (0, _.getConfig)();
    expect(() => (0, _fs.accessSync)(configPath, _fs.R_OK)).not.toThrow();
  });

  it('should find a data directory', () => {
    const dataPath = (0, _.getData)();
    expect(() => (0, _fs.accessSync)(dataPath, _fs.R_OK)).not.toThrow();
  });
});