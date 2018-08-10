'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiComboBoxInput = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactInputAutosize = require('react-input-autosize');

var _reactInputAutosize2 = _interopRequireDefault(_reactInputAutosize);

var _accessibility = require('../../accessibility');

var _form = require('../../form');

var _combo_box_pill = require('./combo_box_pill');

var _services = require('../../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var makeId = (0, _services.htmlIdGenerator)();

var EuiComboBoxInput = exports.EuiComboBoxInput = function (_Component) {
  _inherits(EuiComboBoxInput, _Component);

  function EuiComboBoxInput(props) {
    _classCallCheck(this, EuiComboBoxInput);

    var _this = _possibleConstructorReturn(this, (EuiComboBoxInput.__proto__ || Object.getPrototypeOf(EuiComboBoxInput)).call(this, props));

    _this.updatePosition = function () {
      // Wait a beat for the DOM to update, since we depend on DOM elements' bounds.
      requestAnimationFrame(function () {
        _this.props.updatePosition();
      });
    };

    _this.onFocus = function () {
      _this.props.onFocus();
      _this.setState({
        hasFocus: true
      });
    };

    _this.onBlur = function () {
      _this.setState({
        hasFocus: false
      });
    };

    _this.state = {
      hasFocus: false
    };
    return _this;
  }

  _createClass(EuiComboBoxInput, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      var searchValue = nextProps.searchValue;

      // We need to update the position of everything if the user enters enough input to change
      // the size of the input.

      if (searchValue !== this.props.searchValue) {
        this.updatePosition();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          placeholder = _props.placeholder,
          selectedOptions = _props.selectedOptions,
          onRemoveOption = _props.onRemoveOption,
          onClick = _props.onClick,
          _onChange = _props.onChange,
          value = _props.value,
          searchValue = _props.searchValue,
          autoSizeInputRef = _props.autoSizeInputRef,
          inputRef = _props.inputRef;


      var pills = selectedOptions.map(function (option) {
        var label = option.label,
            color = option.color,
            rest = _objectWithoutProperties(option, ['label', 'color']);

        return _react2.default.createElement(
          _combo_box_pill.EuiComboBoxPill,
          _extends({
            option: option,
            onClose: onRemoveOption,
            key: label.toLowerCase(),
            color: color
          }, rest),
          label
        );
      });

      var removeOptionMessage = void 0;
      var removeOptionMessageId = void 0;

      if (this.state.hasFocus) {
        var removeOptionMessageContent = 'Combo box. Selected. ' + (searchValue ? searchValue + '. Selected. ' : '') + (selectedOptions.length ? value + '. Unselected. Press Backspace to delete ' + selectedOptions[selectedOptions.length - 1].label + '. ' : '') + 'You are currently on a combo box. Type text or, to display a list of choices, press Down Arrow. ' + 'To exit the list of choices, press Escape.';

        removeOptionMessageId = makeId();

        // aria-live="assertive" will read this message aloud immediately once it enters the DOM.
        // We'll render to the DOM when the input gains focus and remove it when the input loses focus.
        // We'll use aria-hidden to prevent default aria information from being read by the screen
        // reader.
        removeOptionMessage = _react2.default.createElement(
          _accessibility.EuiScreenReaderOnly,
          null,
          _react2.default.createElement(
            'span',
            { 'aria-live': 'assertive', id: removeOptionMessageId },
            removeOptionMessageContent
          )
        );
      }

      var placeholderMessage = void 0;

      if (placeholder && !selectedOptions.length && !searchValue) {
        placeholderMessage = _react2.default.createElement(
          'p',
          { className: 'euiComboBoxPlaceholder' },
          placeholder
        );
      }

      return _react2.default.createElement(
        _form.EuiFormControlLayout,
        {
          icon: 'arrowDown',
          iconSide: 'right'
        },
        _react2.default.createElement(
          'div',
          {
            className: 'euiComboBox__inputWrap',
            onClick: onClick,
            'data-test-subj': 'comboBoxInput'
          },
          pills,
          placeholderMessage,
          _react2.default.createElement(_reactInputAutosize2.default, {
            'aria-hidden': true,
            id: id,
            style: { fontSize: 14 },
            className: 'euiComboBox__input',
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onChange: function onChange(e) {
              return _onChange(e.target.value);
            },
            value: searchValue,
            ref: autoSizeInputRef,
            inputRef: inputRef
          }),
          removeOptionMessage
        )
      );
    }
  }]);

  return EuiComboBoxInput;
}(_react.Component);

EuiComboBoxInput.propTypes = {
  id: _propTypes2.default.string,
  placeholder: _propTypes2.default.string,
  selectedOptions: _propTypes2.default.array,
  onRemoveOption: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.string,
  searchValue: _propTypes2.default.string,
  autoSizeInputRef: _propTypes2.default.func,
  inputRef: _propTypes2.default.func,
  updatePosition: _propTypes2.default.func.isRequired
};
EuiComboBoxInput.__docgenInfo = [{
  'description': '',
  'displayName': 'EuiComboBoxInput',
  'methods': [{
    'name': 'updatePosition',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'onFocus',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'onBlur',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }],
  'props': {
    'id': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'placeholder': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'selectedOptions': {
      'type': {
        'name': 'array'
      },
      'required': false,
      'description': ''
    },
    'onRemoveOption': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'onClick': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'onFocus': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'onChange': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'value': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'searchValue': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'autoSizeInputRef': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'inputRef': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'updatePosition': {
      'type': {
        'name': 'func'
      },
      'required': true,
      'description': ''
    }
  }
}];