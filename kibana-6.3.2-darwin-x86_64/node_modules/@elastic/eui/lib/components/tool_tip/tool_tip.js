'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiToolTip = exports.POSITIONS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _portal = require('../portal');

var _tool_tip_popover = require('./tool_tip_popover');

var _services = require('../../services');

var _make_id = require('../form/form_row/make_id');

var _make_id2 = _interopRequireDefault(_make_id);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var positionsToClassNameMap = {
  top: 'euiToolTip--top',
  right: 'euiToolTip--right',
  bottom: 'euiToolTip--bottom',
  left: 'euiToolTip--left'
};

var POSITIONS = exports.POSITIONS = Object.keys(positionsToClassNameMap);

var EuiToolTip = exports.EuiToolTip = function (_Component) {
  _inherits(EuiToolTip, _Component);

  function EuiToolTip(props) {
    _classCallCheck(this, EuiToolTip);

    var _this = _possibleConstructorReturn(this, (EuiToolTip.__proto__ || Object.getPrototypeOf(EuiToolTip)).call(this, props));

    _this.showToolTip = function () {
      _this.setState({ visible: true });
    };

    _this.positionToolTip = function (toolTipBounds) {
      var anchorBounds = _this.anchor.getBoundingClientRect();
      var requestedPosition = _this.props.position;

      var _calculatePopoverPosi = (0, _services.calculatePopoverPosition)(anchorBounds, toolTipBounds, requestedPosition),
          position = _calculatePopoverPosi.position,
          left = _calculatePopoverPosi.left,
          top = _calculatePopoverPosi.top;

      var toolTipStyles = {
        top: top + window.scrollY,
        left: left
      };

      _this.setState({
        visible: true,
        calculatedPosition: position,
        toolTipStyles: toolTipStyles
      });
    };

    _this.hideToolTip = function () {
      _this.setState({ visible: false });
    };

    _this.onFocus = function () {
      _this.setState({
        hasFocus: true
      });
      _this.showToolTip();
    };

    _this.onBlur = function () {
      _this.setState({
        hasFocus: false
      });
      _this.hideToolTip();
    };

    _this.onMouseOut = function (e) {
      // Prevent mousing over children from hiding the tooltip by testing for whether the mouse has
      // left the anchor for a non-child.
      if (_this.anchor === e.relatedTarget || !_this.anchor.contains(e.relatedTarget)) {
        if (!_this.state.hasFocus) {
          _this.hideToolTip();
        }
      }
    };

    _this.state = {
      visible: false,
      hasFocus: false,
      calculatedPosition: _this.props.position,
      toolTipStyles: {},
      id: _this.props.id || (0, _make_id2.default)()
    };
    return _this;
  }

  _createClass(EuiToolTip, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          content = _props.content,
          title = _props.title,
          rest = _objectWithoutProperties(_props, ['children', 'className', 'content', 'title']);

      var classes = (0, _classnames2.default)('euiToolTip', positionsToClassNameMap[this.state.calculatedPosition], className);

      var tooltip = void 0;
      if (this.state.visible) {
        tooltip = _react2.default.createElement(
          _portal.EuiPortal,
          null,
          _react2.default.createElement(
            _tool_tip_popover.EuiToolTipPopover,
            _extends({
              className: classes,
              style: this.state.toolTipStyles,
              positionToolTip: this.positionToolTip,
              title: title,
              id: this.state.id,
              role: 'tooltip'
            }, rest),
            content
          )
        );
      }

      var anchor = _react2.default.createElement(
        'span',
        {
          ref: function ref(anchor) {
            return _this2.anchor = anchor;
          },
          className: 'euiToolTipAnchor'
        },
        (0, _react.cloneElement)(children, {
          onFocus: this.showToolTip,
          onBlur: this.hideToolTip,
          'aria-describedby': this.state.id,
          onMouseOver: this.showToolTip,
          onMouseOut: this.onMouseOut
        })
      );

      return _react2.default.createElement(
        _react.Fragment,
        null,
        anchor,
        tooltip
      );
    }
  }]);

  return EuiToolTip;
}(_react.Component);

EuiToolTip.propTypes = {
  /**
   * The in-view trigger for your tooltip.
   */
  children: _propTypes2.default.element.isRequired,
  /**
   * The main content of your tooltip.
   */
  content: _propTypes2.default.node.isRequired,

  /**
   * An optional title for your tooltip.
   */
  title: _propTypes2.default.node,

  /**
   * Suggested position. If there is not enough room for it this will be changed.
   */
  position: _propTypes2.default.oneOf(POSITIONS),

  /**
   * Passes onto the tooltip itself, not the trigger.
   */
  className: _propTypes2.default.string,

  /**
   * Unless you provide one, this will be randomly generated.
   */
  id: _propTypes2.default.string
};

EuiToolTip.defaultProps = {
  position: 'top'
};
EuiToolTip.__docgenInfo = [{
  'description': '',
  'displayName': 'EuiToolTip',
  'methods': [{
    'name': 'showToolTip',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'positionToolTip',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'toolTipBounds',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'hideToolTip',
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
  }, {
    'name': 'onMouseOut',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'e',
      'type': null
    }],
    'returns': null
  }],
  'props': {
    'children': {
      'type': {
        'name': 'element'
      },
      'required': true,
      'description': 'The in-view trigger for your tooltip.'
    },
    'content': {
      'type': {
        'name': 'node'
      },
      'required': true,
      'description': 'The main content of your tooltip.'
    },
    'title': {
      'type': {
        'name': 'node'
      },
      'required': false,
      'description': 'An optional title for your tooltip.'
    },
    'position': {
      'type': {
        'name': 'enum',
        'value': [{
          'value': '"top"',
          'computed': false
        }, {
          'value': '"right"',
          'computed': false
        }, {
          'value': '"bottom"',
          'computed': false
        }, {
          'value': '"left"',
          'computed': false
        }]
      },
      'required': false,
      'description': 'Suggested position. If there is not enough room for it this will be changed.',
      'defaultValue': {
        'value': '\'top\'',
        'computed': false
      }
    },
    'className': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'Passes onto the tooltip itself, not the trigger.'
    },
    'id': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'Unless you provide one, this will be randomly generated.'
    }
  }
}];