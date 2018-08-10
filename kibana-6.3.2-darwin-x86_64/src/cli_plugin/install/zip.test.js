'use strict';

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _zip = require('./zip');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('kibana cli', function () {

  describe('zip', function () {
    const repliesPath = _path2.default.resolve(__dirname, '__fixtures__', 'replies');
    const archivePath = _path2.default.resolve(repliesPath, 'test_plugin.zip');

    let tempPath;

    beforeEach(() => {
      const randomDir = Math.random().toString(36);
      tempPath = _path2.default.resolve(_os2.default.tmpdir(), randomDir);
    });

    afterEach(() => {
      _rimraf2.default.sync(tempPath);
    });

    describe('analyzeArchive', function () {
      it('returns array of plugins', async () => {
        const packages = await (0, _zip.analyzeArchive)(archivePath);
        const plugin = packages[0];

        expect(packages).toBeInstanceOf(Array);
        expect(plugin.name).toBe('test-plugin');
        expect(plugin.archivePath).toBe('kibana/test-plugin');
        expect(plugin.archive).toBe(archivePath);
        expect(plugin.kibanaVersion).toBe('1.0.0');
      });
    });

    describe('extractArchive', () => {
      it('extracts files using the extractPath filter', async () => {
        const archive = _path2.default.resolve(repliesPath, 'test_plugin_many.zip');

        await (0, _zip.extractArchive)(archive, tempPath, 'kibana/test-plugin');
        const files = await _glob2.default.sync('**/*', { cwd: tempPath });

        const expected = ['extra file only in zip.txt', 'index.js', 'package.json', 'public', 'public/app.js', 'README.md'];
        expect(files.sort()).toEqual(expected.sort());
      });
    });

    it('handles a corrupt zip archive', async () => {
      try {
        await (0, _zip.extractArchive)(_path2.default.resolve(repliesPath, 'corrupt.zip'));
        throw new Error('This should have failed');
      } catch (e) {
        return;
      }
    });
  });

  describe('_isDirectory', () => {
    it('should check for a forward slash', () => {
      expect((0, _zip._isDirectory)('/foo/bar/')).toBe(true);
    });

    it('should check for a backslash', () => {
      expect((0, _zip._isDirectory)('\\foo\\bar\\')).toBe(true);
    });

    it('should return false for files', () => {
      expect((0, _zip._isDirectory)('foo.txt')).toBe(false);
      expect((0, _zip._isDirectory)('\\path\\to\\foo.txt')).toBe(false);
      expect((0, _zip._isDirectory)('/path/to/foo.txt')).toBe(false);
    });
  });
});