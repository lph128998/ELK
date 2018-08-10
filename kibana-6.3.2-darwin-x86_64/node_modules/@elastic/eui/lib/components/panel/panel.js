'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPanel = exports.SIZES = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var paddingSizeToClassNameMap = {
  none: null,
  s: 'euiPanel--paddingSmall',
  m: 'euiPanel--paddingMedium',
  l: 'euiPanel--paddingLarge'
};

var SIZES = exports.SIZES = Object.keys(paddingSizeToClassNameMap);

var EuiPanel = function EuiPanel(_ref) {
  var children = _ref.children,
      className = _ref.className,
      paddingSize = _ref.paddingSize,
      hasShadow = _ref.hasShadow,
      grow = _ref.grow,
      panelRef = _ref.panelRef,
      onClick = _ref.onClick,
      rest = _objectWithoutProperties(_ref, ['children', 'className', 'paddingSize', 'hasShadow', 'grow', 'panelRef', 'onClick']);

  var classes = (0, _classnames2.default)('euiPanel', paddingSizeToClassNameMap[paddingSize], {
    'euiPanel--shadow': hasShadow,
    'euiPanel--flexGrowZero': !grow,
    'euiPanel--isClickable': onClick
  }, className);

  var PanelTag = onClick ? 'button' : 'div';

  var props = {
    ref: panelRef,
    className: classes
  };

  // Avoid passing down this prop if it hasn't been supplied, in order to
  // avoid noise in react-test-renderer snapshots.
  if (onClick != null) {
    props.onClick = onClick;
  }

  return _react2.default.createElement(
    PanelTag,
    _extends({}, props, rest),
    children
  );
};

exports.EuiPanel = EuiPanel;
EuiPanel.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  hasShadow: _propTypes2.default.bool,
  paddingSize: _propTypes2.default.oneOf(SIZES),
  grow: _propTypes2.default.bool,
  panelRef: _propTypes2.default.func,
  onClick: _propTypes2.default.func
};

EuiPanel.defaultProps = {
  paddingSize: 'm',
  hasShadow: false,
  grow: true
};
EuiPanel.__docgenInfo = [{
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
    'hasShadow': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': 'false',
        'computed': false
      }
    },
    'paddingSize': {
      'type': {
        'name': 'enum',
        'value': [{
          'value': '"none"',
          'computed': false
        }, {
          'value': '"s"',
          'computed': false
        }, {
          'value': '"m"',
          'computed': false
        }, {
          'value': '"l"',
          'computed': false
        }]
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': '\'m\'',
        'computed': false
      }
    },
    'grow': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': 'true',
        'computed': false
      }
    },
    'panelRef': {
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
    }
  }
}];