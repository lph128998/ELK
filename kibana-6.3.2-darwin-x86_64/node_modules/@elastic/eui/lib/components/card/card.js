'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCard = exports.ALIGNMENTS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _text = require('../text');

var _title = require('../title');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var textAlignToClassNameMap = {
  left: 'euiCard--leftAligned',
  center: 'euiCard--centerAligned',
  right: 'euiCard--rightAligned'
};

var ALIGNMENTS = exports.ALIGNMENTS = Object.keys(textAlignToClassNameMap);

var EuiCard = function EuiCard(_ref) {
  var className = _ref.className,
      description = _ref.description,
      title = _ref.title,
      icon = _ref.icon,
      image = _ref.image,
      footer = _ref.footer,
      onClick = _ref.onClick,
      href = _ref.href,
      textAlign = _ref.textAlign,
      isClickable = _ref.isClickable,
      rest = _objectWithoutProperties(_ref, ['className', 'description', 'title', 'icon', 'image', 'footer', 'onClick', 'href', 'textAlign', 'isClickable']);

  var classes = (0, _classnames2.default)('euiCard', textAlignToClassNameMap[textAlign], {
    'euiCard--isClickable': onClick || href || isClickable
  }, className);

  var imageNode = void 0;
  if (image) {
    imageNode = _react2.default.createElement('img', { className: 'euiCard__image', src: image, alt: '' });
  }

  var iconNode = void 0;
  if (icon) {
    iconNode = _react2.default.cloneElement(icon, { className: 'euiCard__icon' });
  }

  var OuterElement = 'div';
  if (href) {
    OuterElement = 'a';
  } else if (onClick) {
    OuterElement = 'button';
  }

  return _react2.default.createElement(
    OuterElement,
    _extends({
      onClick: onClick,
      className: classes,
      href: href
    }, rest),
    _react2.default.createElement(
      'span',
      { className: 'euiCard__top' },
      imageNode,
      iconNode
    ),
    _react2.default.createElement(
      'span',
      { className: 'euiCard__content' },
      _react2.default.createElement(
        _title.EuiTitle,
        { size: 's', className: 'euiCard__title' },
        _react2.default.createElement(
          'span',
          null,
          title
        )
      ),
      _react2.default.createElement(
        _text.EuiText,
        { size: 's', className: 'euiCard__description' },
        _react2.default.createElement(
          'p',
          null,
          description
        )
      )
    ),
    _react2.default.createElement(
      'span',
      { className: 'euiCard__footer' },
      footer
    )
  );
};

exports.EuiCard = EuiCard;
EuiCard.propTypes = {
  className: _propTypes2.default.string,
  title: _propTypes2.default.node.isRequired,
  description: _propTypes2.default.node.isRequired,

  /**
   * Requires a <EuiIcon> node
   */
  icon: _propTypes2.default.node,

  /**
   * Accepts a url in string form
   */
  image: _propTypes2.default.string,

  /**
   * Accepts any combination of elements
   */
  footer: _propTypes2.default.node,

  /**
   * Use only if you want to forego a button in the footer and make the whole card clickable
   */
  onClick: _propTypes2.default.func,
  href: _propTypes2.default.string,
  textAlign: _propTypes2.default.oneOf(ALIGNMENTS)
};

EuiCard.defaultProps = {
  textAlign: 'center'
};
EuiCard.__docgenInfo = [{
  'description': '',
  'methods': [],
  'props': {
    'className': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'title': {
      'type': {
        'name': 'node'
      },
      'required': true,
      'description': ''
    },
    'description': {
      'type': {
        'name': 'node'
      },
      'required': true,
      'description': ''
    },
    'icon': {
      'type': {
        'name': 'node'
      },
      'required': false,
      'description': 'Requires a <EuiIcon> node'
    },
    'image': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': 'Accepts a url in string form'
    },
    'footer': {
      'type': {
        'name': 'node'
      },
      'required': false,
      'description': 'Accepts any combination of elements'
    },
    'onClick': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': 'Use only if you want to forego a button in the footer and make the whole card clickable'
    },
    'href': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'textAlign': {
      'type': {
        'name': 'enum',
        'value': [{
          'value': '"left"',
          'computed': false
        }, {
          'value': '"center"',
          'computed': false
        }, {
          'value': '"right"',
          'computed': false
        }]
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': '\'center\'',
        'computed': false
      }
    }
  }
}];