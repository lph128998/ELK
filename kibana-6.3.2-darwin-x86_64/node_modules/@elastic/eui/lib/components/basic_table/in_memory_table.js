'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiInMemoryTable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _basic_table = require('./basic_table');

var _pagination_bar = require('./pagination_bar');

var _predicate = require('../../services/predicate');

var _sort = require('../../services/sort');

var _search_bar = require('../search_bar');

var _spacer = require('../spacer/spacer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InMemoryTablePropTypes = {
  columns: _propTypes2.default.arrayOf(_basic_table.ColumnType).isRequired,
  items: _propTypes2.default.array,
  loading: _propTypes2.default.bool,
  message: _propTypes2.default.node,
  error: _propTypes2.default.string,
  search: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.shape({
    defaultQuery: _search_bar.QueryType,
    box: _propTypes2.default.shape(_extends({}, _search_bar.SearchBoxConfigPropTypes, {
      schema: _propTypes2.default.oneOfType([
      // here we enable the user to just assign 'true' to the schema, in which case
      // we will auto-generate it out of the columns configuration
      _propTypes2.default.bool, _search_bar.SearchBoxConfigPropTypes.schema])
    })),
    filters: _search_bar.SearchFiltersFiltersType,
    onChange: _propTypes2.default.func
  })]),
  pagination: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.shape({
    pageSizeOptions: _propTypes2.default.arrayOf(_propTypes2.default.number)
  }), _propTypes2.default.shape({
    initialPageSize: _propTypes2.default.number,
    pageSizeOptions: _propTypes2.default.arrayOf(_propTypes2.default.number)
  })]),
  sorting: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.shape({
    sort: _sort.PropertySortType
  })]),
  selection: _basic_table.SelectionType
};

var getInitialQuery = function getInitialQuery(search) {
  if (!search) {
    return;
  }

  var query = search.defaultQuery || '';
  return (0, _predicate.isString)(query) ? _search_bar.EuiSearchBar.Query.parse(query) : query;
};

var getInitialPagination = function getInitialPagination(pagination) {
  if (!pagination) {
    return {
      pageIndex: undefined,
      pageSize: undefined
    };
  }

  var initialPageSize = pagination.initialPageSize,
      _pagination$pageSizeO = pagination.pageSizeOptions,
      pageSizeOptions = _pagination$pageSizeO === undefined ? _pagination_bar.defaults.pageSizeOptions : _pagination$pageSizeO;


  if (initialPageSize && (!pageSizeOptions || !pageSizeOptions.includes(initialPageSize))) {
    throw new Error('EuiInMemoryTable received initialPageSize ' + initialPageSize + ', which wasn\'t provided within pageSizeOptions.');
  }

  var defaultPageSize = pageSizeOptions ? pageSizeOptions[0] : _pagination_bar.defaults.pageSizeOptions[0];

  return {
    pageIndex: 0,
    pageSize: initialPageSize || defaultPageSize,
    pageSizeOptions: pageSizeOptions
  };
};

var getInitialSorting = function getInitialSorting(sorting) {
  if (!sorting || !sorting.sort) {
    return {
      sortField: undefined,
      sortDirection: undefined
    };
  }

  var _sorting$sort = sorting.sort,
      sortField = _sorting$sort.field,
      sortDirection = _sorting$sort.direction;


  return {
    sortField: sortField,
    sortDirection: sortDirection
  };
};

var EuiInMemoryTable = exports.EuiInMemoryTable = function (_Component) {
  _inherits(EuiInMemoryTable, _Component);

  function EuiInMemoryTable(props) {
    _classCallCheck(this, EuiInMemoryTable);

    var _this = _possibleConstructorReturn(this, (EuiInMemoryTable.__proto__ || Object.getPrototypeOf(EuiInMemoryTable)).call(this, props));

    _initialiseProps.call(_this);

    var search = props.search,
        pagination = props.pagination,
        sorting = props.sorting;

    var _getInitialPagination = getInitialPagination(pagination),
        pageIndex = _getInitialPagination.pageIndex,
        pageSize = _getInitialPagination.pageSize,
        pageSizeOptions = _getInitialPagination.pageSizeOptions;

    var _getInitialSorting = getInitialSorting(sorting),
        sortField = _getInitialSorting.sortField,
        sortDirection = _getInitialSorting.sortDirection;

    _this.state = {
      query: getInitialQuery(search),
      pageIndex: pageIndex,
      pageSize: pageSize,
      pageSizeOptions: pageSizeOptions,
      sortField: sortField,
      sortDirection: sortDirection
    };
    return _this;
  }

  _createClass(EuiInMemoryTable, [{
    key: 'onQueryChange',
    value: function onQueryChange(query) {
      if (this.props.search.onChange) {
        var shouldQueryInMemory = this.props.search.onChange(query);
        if (!shouldQueryInMemory) {
          return;
        }
      }
      this.setState({
        query: query
      });
    }
  }, {
    key: 'renderSearchBar',
    value: function renderSearchBar() {
      var search = this.props.search;

      if (search) {
        var _ref = (0, _predicate.isBoolean)(search) ? {} : search,
            onChange = _ref.onChange,
            searchBarProps = _objectWithoutProperties(_ref, ['onChange']);

        if (searchBarProps.box && searchBarProps.box.schema === true) {
          searchBarProps.box.schema = this.resolveSearchSchema();
        }

        return _react2.default.createElement(_search_bar.EuiSearchBar, _extends({
          onChange: this.onQueryChange.bind(this)
        }, searchBarProps));
      }
    }
  }, {
    key: 'resolveSearchSchema',
    value: function resolveSearchSchema() {
      var columns = this.props.columns;

      return columns.reduce(function (schema, column) {
        if (column.field) {
          var type = column.dataType || 'string';
          schema.fields[column.field] = { type: type };
        }
        return schema;
      }, { strict: true, fields: {} });
    }
  }, {
    key: 'getItems',
    value: function getItems() {
      var items = this.props.items;


      if (!items.length) {
        return {
          items: [],
          totalItemCount: 0
        };
      }

      var _state = this.state,
          query = _state.query,
          sortField = _state.sortField,
          sortDirection = _state.sortDirection,
          pageIndex = _state.pageIndex,
          pageSize = _state.pageSize;


      var matchingItems = query ? _search_bar.EuiSearchBar.Query.execute(query, items) : items;

      var sortedItems = sortField ? matchingItems.sort(_sort.Comparators.property(sortField, _sort.Comparators.default(sortDirection))) : matchingItems;

      var visibleItems = pageSize ? function () {
        var startIndex = pageIndex * pageSize;
        return sortedItems.slice(startIndex, Math.min(startIndex + pageSize, sortedItems.length));
      }() : sortedItems;

      return {
        items: visibleItems,
        totalItemCount: matchingItems.length
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          columns = _props.columns,
          loading = _props.loading,
          message = _props.message,
          error = _props.error,
          selection = _props.selection,
          hasPagination = _props.pagination,
          hasSorting = _props.sorting;
      var _state2 = this.state,
          pageIndex = _state2.pageIndex,
          pageSize = _state2.pageSize,
          pageSizeOptions = _state2.pageSizeOptions,
          sortField = _state2.sortField,
          sortDirection = _state2.sortDirection;

      var _getItems = this.getItems(),
          items = _getItems.items,
          totalItemCount = _getItems.totalItemCount;

      var pagination = !hasPagination ? undefined : {
        pageIndex: pageIndex,
        pageSize: pageSize,
        pageSizeOptions: pageSizeOptions,
        totalItemCount: totalItemCount
      };

      // Data loaded from a server can have a default sort order which is meaningful to the
      // user, but can't be reproduced with client-side sort logic. So we allow the table to display
      // rows in the order in which they're initially loaded by providing an undefined sorting prop.
      // Once a user sorts a column, this will become a fully-defined sorting prop.
      var sorting = !hasSorting ? undefined : {
        sort: !sortField && !sortDirection ? undefined : {
          field: sortField,
          direction: sortDirection
        }
      };

      var searchBar = this.renderSearchBar();

      var table = _react2.default.createElement(_basic_table.EuiBasicTable, {
        items: items,
        columns: columns,
        pagination: pagination,
        sorting: sorting,
        selection: selection,
        onChange: this.onTableChange,
        error: error,
        loading: loading,
        noItemsMessage: message
      });

      if (!searchBar) {
        return table;
      }

      return _react2.default.createElement(
        'div',
        null,
        searchBar,
        _react2.default.createElement(_spacer.EuiSpacer, { size: 'l' }),
        table
      );
    }
  }]);

  return EuiInMemoryTable;
}(_react.Component);

EuiInMemoryTable.propTypes = InMemoryTablePropTypes;
EuiInMemoryTable.defaultProps = {
  items: [],
  pagination: false,
  sorting: false
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onTableChange = function (_ref2) {
    var _ref2$page = _ref2.page,
        page = _ref2$page === undefined ? {} : _ref2$page,
        _ref2$sort = _ref2.sort,
        sort = _ref2$sort === undefined ? {} : _ref2$sort;
    var pageIndex = page.index,
        pageSize = page.size;
    var sortField = sort.field,
        sortDirection = sort.direction;


    _this2.setState({
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortField: sortField,
      sortDirection: sortDirection
    });
  };
};

EuiInMemoryTable.__docgenInfo = [{
  'description': '',
  'displayName': 'EuiInMemoryTable',
  'methods': [{
    'name': 'onTableChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': '{ page = {}, sort = {} }',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onQueryChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'query',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderSearchBar',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'resolveSearchSchema',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'getItems',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }],
  'props': {
    'columns': {
      'type': {
        'name': 'arrayOf',
        'value': {
          'name': 'custom',
          'raw': 'ColumnType'
        }
      },
      'required': true,
      'description': ''
    },
    'items': {
      'type': {
        'name': 'array'
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': '[]',
        'computed': false
      }
    },
    'loading': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    },
    'message': {
      'type': {
        'name': 'node'
      },
      'required': false,
      'description': ''
    },
    'error': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'search': {
      'type': {
        'name': 'union',
        'value': [{
          'name': 'bool'
        }, {
          'name': 'shape',
          'value': {
            'defaultQuery': {
              'name': 'custom',
              'raw': 'QueryType',
              'required': false
            },
            'box': {
              'name': 'shape',
              'value': {
                'schema': {
                  'name': 'union',
                  'value': [{
                    'name': 'bool'
                  }, {
                    'name': 'custom',
                    'raw': 'SearchBoxConfigPropTypes.schema'
                  }],
                  'required': false
                }
              },
              'required': false
            },
            'filters': {
              'name': 'custom',
              'raw': 'SearchFiltersFiltersType',
              'required': false
            },
            'onChange': {
              'name': 'func',
              'required': false
            }
          }
        }]
      },
      'required': false,
      'description': ''
    },
    'pagination': {
      'type': {
        'name': 'union',
        'value': [{
          'name': 'bool'
        }, {
          'name': 'shape',
          'value': {
            'pageSizeOptions': {
              'name': 'arrayOf',
              'value': {
                'name': 'number'
              },
              'required': false
            }
          }
        }, {
          'name': 'shape',
          'value': {
            'initialPageSize': {
              'name': 'number',
              'required': false
            },
            'pageSizeOptions': {
              'name': 'arrayOf',
              'value': {
                'name': 'number'
              },
              'required': false
            }
          }
        }]
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': 'false',
        'computed': false
      }
    },
    'sorting': {
      'type': {
        'name': 'union',
        'value': [{
          'name': 'bool'
        }, {
          'name': 'shape',
          'value': {
            'sort': {
              'name': 'custom',
              'raw': 'PropertySortType',
              'required': false
            }
          }
        }]
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': 'false',
        'computed': false
      }
    },
    'selection': {
      'type': {
        'name': 'custom',
        'raw': 'SelectionType'
      },
      'required': false,
      'description': ''
    }
  }
}];