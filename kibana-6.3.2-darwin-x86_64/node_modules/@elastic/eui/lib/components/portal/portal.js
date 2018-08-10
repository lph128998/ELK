'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPortal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * NOTE: We can't test this component because Enzyme doesn't support rendering
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * into portals.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * NOTE: You **cannot** immediately return a EuiPortal from within the render method! This is
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * because the portalNode doesn't exist until **after** it's mounted. In its current form, EuiPortal
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * can only be used by components which are hidden or otherwise not rendered initially, like
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * dropdowns and modals. If we want to support components wrapped in EuiPortal being visible
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * immediately we can update EuiPortal to accept a DOM node as a prop, which should solve the problem.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var EuiPortal = exports.EuiPortal = function (_Component) {
  _inherits(EuiPortal, _Component);

  function EuiPortal(props) {
    _classCallCheck(this, EuiPortal);

    var _this = _possibleConstructorReturn(this, (EuiPortal.__proto__ || Object.getPrototypeOf(EuiPortal)).call(this, props));

    var children = _this.props.children;


    _this.portalNode = document.createElement('div');
    return _this;
  }

  _createClass(EuiPortal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.body.appendChild(this.portalNode);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.body.removeChild(this.portalNode);
      this.portalNode = null;
    }
  }, {
    key: 'render',
    value: function render() {
      return (0, _reactDom.createPortal)(this.props.children, this.portalNode);
    }
  }]);

  return EuiPortal;
}(_react.Component);

EuiPortal.propTypes = {
  children: _propTypes2.default.node
};
EuiPortal.__docgenInfo = [{
  'description': '',
  'displayName': 'EuiPortal',
  'methods': [],
  'props': {
    'children': {
      'type': {
        'name': 'node'
      },
      'required': false,
      'description': ''
    }
  }
}];