'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFilterButton = exports.ICON_SIDES = exports.COLORS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _services = require('../../services');

var _icon = require('../icon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var colorToClassNameMap = {
  primary: 'euiFilterButton--primary',
  danger: 'euiFilterButton--danger',
  disabled: 'euiFilterButton--disabled',
  text: 'euiFilterButton--text',
  ghost: 'euiFilterButton--ghost'
};

var COLORS = exports.COLORS = Object.keys(colorToClassNameMap);

var iconSideToClassNameMap = {
  left: '',
  right: 'euiFilterButton--iconRight'
};

var ICON_SIDES = exports.ICON_SIDES = Object.keys(iconSideToClassNameMap);

var EuiFilterButton = function EuiFilterButton(_ref) {
  var children = _ref.children,
      className = _ref.className,
      iconType = _ref.iconType,
      iconSide = _ref.iconSide,
      color = _ref.color,
      hasActiveFilters = _ref.hasActiveFilters,
      isDisabled = _ref.isDisabled,
      isSelected = _ref.isSelected,
      href = _ref.href,
      target = _ref.target,
      rel = _ref.rel,
      type = _ref.type,
      rest = _objectWithoutProperties(_ref, ['children', 'className', 'iconType', 'iconSide', 'color', 'hasActiveFilters', 'isDisabled', 'isSelected', 'href', 'target', 'rel', 'type']);

  var classes = (0, _classnames2.default)('euiFilterButton', colorToClassNameMap[color], iconSideToClassNameMap[iconSide], {
    'euiFilterButton-isSelected': isSelected,
    'euiFilterButton-hasActiveFilters': hasActiveFilters
  }, className);

  // Add an icon to the button if one exists.
  var buttonIcon = void 0;

  if (iconType) {
    buttonIcon = _react2.default.createElement(_icon.EuiIcon, {
      className: 'euiFilterButton__icon',
      type: iconType,
      size: 'm',
      'aria-hidden': 'true'
    });
  }

  if (href) {
    var secureRel = (0, _services.getSecureRelForTarget)(target, rel);

    return _react2.default.createElement(
      'a',
      _extends({
        className: classes,
        href: href,
        target: target,
        rel: secureRel
      }, rest),
      _react2.default.createElement(
        'span',
        { className: 'euiFilterButton__content' },
        buttonIcon,
        _react2.default.createElement(
          'span',
          { className: 'euiFilterButton__textShift', 'data-text': children },
          children
        )
      )
    );
  } else {
    return _react2.default.createElement(
      'button',
      _extends({
        disabled: isDisabled,
        className: classes,
        type: type
      }, rest),
      _react2.default.createElement(
        'span',
        { className: 'euiFilterButton__content' },
        buttonIcon,
        _react2.default.createElement(
          'span',
          { className: 'euiFilterButton__textShift', 'data-text': children },
          children
        )
      )
    );
  }
};

exports.EuiFilterButton = EuiFilterButton;
EuiFilterButton.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  onClick: _propTypes2.default.func,
  /**
   * Use any one of our icons
   */
  iconType: _propTypes2.default.oneOf(_icon.ICON_TYPES),
  iconSide: _propTypes2.default.oneOf(ICON_SIDES),
  color: _propTypes2.default.oneOf(COLORS),
  /**
   * Bolds the button if true
   */
  hasActiveFilters: _propTypes2.default.bool,
  /**
   * Applies a visual state to the button useful when using with a popover.
   */
  isSelected: _propTypes2.default.bool,
  isDisabled: _propTypes2.default.bool,
  /**
   * If passed, changes the button to an anchor tag
   */
  href: _propTypes2.default.string,
  /**
   * Used along with href
   */
  target: _propTypes2.default.string,
  /**
   * Used along with href
   */
  rel: _propTypes2.default.string,
  /**
   * Defines html button input type
   */
  type: _propTypes2.default.string
};

EuiFilterButton.defaultProps = {
  type: 'button',
  iconSide: 'right',
  color: 'text'
};
EuiFilterButton.__docgenInfo = [{
  'description': '',
  'methods': [],
  'props': {
    'children': {
      'type': {
        'name': 'node'
      },
      'required': false,
      'description': ''
    },
    'className': {
      'type': {
        'name': 'string'
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
    'iconType': {
      'type': {
        'name': 'enum',
        'computed': true,
        'value': 'ICON_TYPES'
      },
      'required': false,
      'description': 'Use any one of our icons'
    },
    'iconSide': {
      'type': {
        'name': 'enum',
        'value': [{
          'value': '"left"',
          'computed': false
        }, {
          'value': '"right"',
          'computed': false
        }]
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': '\'right\'',
        'computed': false
      }
    },
    'color': {
      'type': {
        'name': 'enum',
        'value': [{
          'value': '"primary"',
          'computed': false
        }, {
          'value': '"danger"',
          'computed': false
        }, {
          'value': '"disabled"',
          'computed': false
        }, {
          'value': '"text"',
          'computed': false
        }, {
          'value': '"ghost"',
          'computed': false
        }]
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': '\'text\'',
        'computed': false
      }
    },
    'hasActiveFilters': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': 'Bolds the button if true'
    },
    'isSelected': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': 'Applies a visual state to the button useful when using with a popover.'
    },
    'isDisabled': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    },
    'href': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'If passed, changes the button to an anchor tag'
    },
    'target': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'Used along with href'
    },
    'rel': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'Used along with href'
    },
    'type': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'Defines html button input type',
      'defaultValue': {
        'value': '\'button\'',
        'computed': false
      }
    }
  }
}];