'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _mockFs = require('mock-fs');

var _mockFs2 = _interopRequireDefault(_mockFs);

var _stream = require('stream');

var _keystore = require('../server/keystore');

var _add = require('./add');

var _logger = require('../cli_plugin/lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _prompt = require('../server/utils/prompt');

var prompt = _interopRequireWildcard(_prompt);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Kibana keystore', () => {
  describe('add', () => {
    const sandbox = _sinon2.default.sandbox.create();

    const keystoreData = '1:IxR0geiUTMJp8ueHDkqeUJ0I9eEw4NJPXIJi22UDyfGfJSy4mH' + 'BBuGPkkAix/x/YFfIxo4tiKGdJ2oVTtU8LgKDkVoGdL+z7ylY4n3myatt6osqhI4lzJ9M' + 'Ry21UcAJki2qFUTj4TYuvhta3LId+RM5UX/dJ2468hQ==';

    beforeEach(() => {
      (0, _mockFs2.default)({
        '/data': {
          'test.keystore': JSON.stringify(keystoreData)
        }
      });

      sandbox.stub(prompt, 'confirm');
      sandbox.stub(prompt, 'question');

      sandbox.stub(_logger2.default.prototype, 'log');
      sandbox.stub(_logger2.default.prototype, 'error');
    });

    afterEach(() => {
      _mockFs2.default.restore();
      sandbox.restore();
    });

    it('returns an error for a nonexistent keystore', async () => {
      const keystore = new _keystore.Keystore('/data/nonexistent.keystore');
      const message = 'ERROR: Kibana keystore not found. Use \'create\' command to create one.';

      await (0, _add.add)(keystore, 'foo');

      _sinon2.default.assert.calledOnce(_logger2.default.prototype.error);
      _sinon2.default.assert.calledWith(_logger2.default.prototype.error, message);
    });

    it('does not attempt to create a keystore', async () => {
      const keystore = new _keystore.Keystore('/data/nonexistent.keystore');
      sandbox.stub(keystore, 'save');

      await (0, _add.add)(keystore, 'foo');

      _sinon2.default.assert.notCalled(keystore.save);
    });

    it('prompts for existing key', async () => {
      prompt.confirm.returns(Promise.resolve(true));
      prompt.question.returns(Promise.resolve('bar'));

      const keystore = new _keystore.Keystore('/data/test.keystore');
      await (0, _add.add)(keystore, 'a2');

      _sinon2.default.assert.calledOnce(prompt.confirm);
      _sinon2.default.assert.calledOnce(prompt.question);

      const { args } = prompt.confirm.getCall(0);

      expect(args[0]).toEqual('Setting a2 already exists. Overwrite?');
    });

    it('aborts if overwrite is denied', async () => {
      prompt.confirm.returns(Promise.resolve(false));

      const keystore = new _keystore.Keystore('/data/test.keystore');
      await (0, _add.add)(keystore, 'a2');

      _sinon2.default.assert.notCalled(prompt.question);

      _sinon2.default.assert.calledOnce(_logger2.default.prototype.log);
      _sinon2.default.assert.calledWith(_logger2.default.prototype.log, 'Exiting without modifying keystore.');
    });

    it('overwrites without prompt if force is supplied', async () => {
      prompt.question.returns(Promise.resolve('bar'));

      const keystore = new _keystore.Keystore('/data/test.keystore');
      sandbox.stub(keystore, 'save');

      await (0, _add.add)(keystore, 'a2', { force: true });

      _sinon2.default.assert.notCalled(prompt.confirm);
      _sinon2.default.assert.calledOnce(keystore.save);
    });

    it('trims value', async () => {
      prompt.question.returns(Promise.resolve('bar\n'));

      const keystore = new _keystore.Keystore('/data/test.keystore');
      sandbox.stub(keystore, 'save');

      await (0, _add.add)(keystore, 'foo');

      expect(keystore.data.foo).toEqual('bar');
    });

    it('persists updated keystore', async () => {
      prompt.question.returns(Promise.resolve('bar\n'));

      const keystore = new _keystore.Keystore('/data/test.keystore');
      sandbox.stub(keystore, 'save');

      await (0, _add.add)(keystore, 'foo');

      _sinon2.default.assert.calledOnce(keystore.save);
    });

    it('accepts stdin', async () => {
      const keystore = new _keystore.Keystore('/data/test.keystore');
      sandbox.stub(keystore, 'save');

      const stdin = new _stream.PassThrough();
      process.nextTick(() => {
        stdin.write('kibana\n');
        stdin.end();
      });

      await (0, _add.add)(keystore, 'foo', { stdin: true, stdinStream: stdin });

      expect(keystore.data.foo).toEqual('kibana');
    });
  });
});