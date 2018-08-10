'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _stream = require('stream');

var _prompt = require('./prompt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('prompt', () => {
  const sandbox = _sinon2.default.sandbox.create();

  let input;
  let output;

  beforeEach(() => {
    input = new _stream.PassThrough();
    output = new _stream.PassThrough();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('confirm', () => {
    it('prompts for question', async () => {
      const onData = sandbox.stub(output, 'write');

      (0, _prompt.confirm)('my question', { output });

      _sinon2.default.assert.calledOnce(onData);

      const { args } = onData.getCall(0);
      expect(args[0]).toEqual('my question [y/N] ');
    });

    it('prompts for question with default true', async () => {
      const onData = sandbox.stub(output, 'write');

      (0, _prompt.confirm)('my question', { output, default: true });

      _sinon2.default.assert.calledOnce(onData);

      const { args } = onData.getCall(0);
      expect(args[0]).toEqual('my question [Y/n] ');
    });

    it('defaults to false', async () => {
      process.nextTick(() => input.write('\n'));

      const answer = await (0, _prompt.confirm)('my question', { output, input });
      expect(answer).toBe(false);
    });

    it('accepts "y"', async () => {
      process.nextTick(() => input.write('y\n'));

      const answer = await (0, _prompt.confirm)('my question', { output, input });
      expect(answer).toBe(true);
    });

    it('accepts "Y"', async () => {
      process.nextTick(() => input.write('Y\n'));

      const answer = await (0, _prompt.confirm)('my question', { output, input });
      expect(answer).toBe(true);
    });

    it('accepts "yes"', async () => {
      process.nextTick(() => input.write('yes\n'));

      const answer = await (0, _prompt.confirm)('my question', { output, input });
      expect(answer).toBe(true);
    });

    it('is false when unknown', async () => {
      process.nextTick(() => input.write('unknown\n'));

      const answer = await (0, _prompt.confirm)('my question', { output, input });
      expect(answer).toBe(false);
    });
  });

  describe('question', () => {
    it('prompts for question', async () => {
      const onData = sandbox.stub(output, 'write');

      (0, _prompt.question)('my question', { output });

      _sinon2.default.assert.calledOnce(onData);

      const { args } = onData.getCall(0);
      expect(args[0]).toEqual('my question: ');
    });

    it('can be answered', async () => {
      process.nextTick(() => input.write('my answer\n'));

      const answer = await (0, _prompt.question)('my question', { input, output });
      expect(answer).toBe('my answer');
    });
  });
});