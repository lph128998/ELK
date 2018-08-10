'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('kibana cli', function () {

  describe('plugin installer', function () {

    describe('commander options', function () {

      const program = {
        command: function () {
          return program;
        },
        description: function () {
          return program;
        },
        option: function () {
          return program;
        },
        action: function () {
          return program;
        }
      };

      it('should define the command', function () {
        _sinon2.default.spy(program, 'command');

        (0, _index2.default)(program);
        expect(program.command.calledWith('install <plugin/url>')).toBe(true);

        program.command.restore();
      });

      it('should define the description', function () {
        _sinon2.default.spy(program, 'description');

        (0, _index2.default)(program);
        expect(program.description.calledWith('install a plugin')).toBe(true);

        program.description.restore();
      });

      it('should define the command line options', function () {
        const spy = _sinon2.default.spy(program, 'option');

        const options = [/-q/, /-s/, /-c/, /-t/, /-d/];

        (0, _index2.default)(program);

        for (let i = 0; i < spy.callCount; i++) {
          const call = spy.getCall(i);
          for (let o = 0; o < options.length; o++) {
            const option = options[o];
            if (call.args[0].match(option)) {
              options.splice(o, 1);
              break;
            }
          }
        }

        expect(options).toHaveLength(0);
      });

      it('should call the action function', function () {
        _sinon2.default.spy(program, 'action');

        (0, _index2.default)(program);
        expect(program.action.calledOnce).toBe(true);

        program.action.restore();
      });
    });
  });
});