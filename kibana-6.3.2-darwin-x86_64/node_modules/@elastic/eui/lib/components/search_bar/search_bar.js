'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSearchBar = exports.SearchBarPropTypes = exports.QueryType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _predicate = require('../../services/predicate');

var _flex_group = require('../flex/flex_group');

var _search_box = require('./search_box');

var _search_filters = require('./search_filters');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _query = require('./query');

var _flex_item = require('../flex/flex_item');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QueryType = exports.QueryType = _propTypes2.default.oneOfType([_propTypes2.default.instanceOf(_query.Query), _propTypes2.default.string]);

var SearchBarPropTypes = exports.SearchBarPropTypes = {
  /**
   * (query: Query) => void
   */
  onChange: _propTypes2.default.func.isRequired,

  /**
   (query?: Query, queryText: string, error?: string) => void
   */
  onParse: _propTypes2.default.func,

  /**
   The initial query the bar will hold when first mounted
   */
  defaultQuery: QueryType,

  /**
   If you wish to use the search bar as a controlled component, continuously pass the query
   via this prop
   */
  query: QueryType,

  /**
   Configures the search box. Set `placeholder` to change the placeholder text in the box and
   `incremental` to support incremental (as you type) search.
   */
  box: _propTypes2.default.shape(_search_box.SearchBoxConfigPropTypes),

  /**
   An array of search filters.
   */
  filters: _search_filters.SearchFiltersFiltersType,

  /**
   * Tools which go to the left of the search bar.
   */
  toolsLeft: _propTypes2.default.node,

  /**
   * Tools which go to the right of the search bar.
   */
  toolsRight: _propTypes2.default.node
};

var parseQuery = function parseQuery(query, props) {
  var parseDate = props.box ? props.box.parseDate : undefined;
  var schema = props.box ? props.box.schema : undefined;
  var parseOptions = {
    parseDate: parseDate,
    schema: schema
  };
  if (!query) {
    return _query.Query.parse('', parseOptions);
  }
  return (0, _predicate.isString)(query) ? _query.Query.parse(query, parseOptions) : query;
};

var EuiSearchBar = exports.EuiSearchBar = function (_Component) {
  _inherits(EuiSearchBar, _Component);

  function EuiSearchBar(props) {
    _classCallCheck(this, EuiSearchBar);

    var _this = _possibleConstructorReturn(this, (EuiSearchBar.__proto__ || Object.getPrototypeOf(EuiSearchBar)).call(this, props));

    _initialiseProps.call(_this);

    var query = parseQuery(props.defaultQuery || props.query, props);
    _this.state = {
      query: query,
      queryText: query.text,
      error: null
    };
    return _this;
  }

  _createClass(EuiSearchBar, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.query) {
        var query = parseQuery(nextProps.query, this.props);
        this.setState({
          query: query,
          queryText: query.text,
          error: null
        });
      }
    }
  }, {
    key: 'renderTools',
    value: function renderTools(tools) {
      if (!tools) {
        return undefined;
      }

      if (Array.isArray(tools)) {
        return tools.map(function (tool) {
          return _react2.default.createElement(
            _flex_item.EuiFlexItem,
            { grow: false, key: tool.key },
            tool
          );
        });
      }

      return _react2.default.createElement(
        _flex_item.EuiFlexItem,
        { grow: false },
        tools
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          query = _state.query,
          queryText = _state.queryText,
          error = _state.error;
      var _props = this.props,
          box = _props.box,
          filters = _props.filters,
          toolsLeft = _props.toolsLeft,
          toolsRight = _props.toolsRight;


      var toolsLeftEl = this.renderTools(toolsLeft);

      var filtersBar = !filters ? undefined : _react2.default.createElement(
        _flex_item.EuiFlexItem,
        { grow: false },
        _react2.default.createElement(_search_filters.EuiSearchFilters, { filters: filters, query: query, onChange: this.onFiltersChange })
      );

      var toolsRightEl = this.renderTools(toolsRight);

      return _react2.default.createElement(
        _flex_group.EuiFlexGroup,
        { gutterSize: 'm', alignItems: 'center' },
        toolsLeftEl,
        _react2.default.createElement(
          _flex_item.EuiFlexItem,
          { grow: true },
          _react2.default.createElement(_search_box.EuiSearchBox, _extends({}, box, {
            query: queryText,
            onSearch: this.onSearch,
            isInvalid: !!error,
            title: error ? error.message : undefined
          }))
        ),
        filtersBar,
        toolsRightEl
      );
    }
  }]);

  return EuiSearchBar;
}(_react.Component);

EuiSearchBar.propTypes = _search_box.SearchBoxConfigPropTypes;
EuiSearchBar.Query = _query.Query;

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onSearch = function (queryText) {
    try {
      var query = parseQuery(queryText, _this2.props);
      if (_this2.props.onParse) {
        _this2.props.onParse({ query: query, queryText: queryText });
      }
      _this2.setState({ query: query, queryText: queryText, error: null });
      _this2.props.onChange(query);
    } catch (e) {
      var error = { message: e.message };
      if (_this2.props.onParse) {
        _this2.props.onParse({ queryText: queryText, error: error });
      }
      _this2.setState({ queryText: queryText, error: error });
    }
  };

  this.onFiltersChange = function (query) {
    _this2.setState({
      query: query,
      queryText: query.text,
      error: null
    });
    _this2.props.onChange(query);
  };
};

EuiSearchBar.__docgenInfo = [{
  'description': '',
  'displayName': 'EuiSearchBar',
  'methods': [{
    'name': 'onSearch',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'queryText',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onFiltersChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'query',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderTools',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'tools',
      'type': null
    }],
    'returns': null
  }],
  'composes': ['./search_box']
}];