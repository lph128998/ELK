'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiBasicTable = exports.SelectionType = exports.ColumnType = exports.ComputedColumnType = exports.FieldDataColumnType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _services = require('../../services');

var _predicate = require('../../services/predicate');

var _objects = require('../../services/objects');

var _table = require('../table/table');

var _table_header_cell_checkbox = require('../table/table_header_cell_checkbox');

var _checkbox = require('../form/checkbox/checkbox');

var _table_header_cell = require('../table/table_header_cell');

var _table_header = require('../table/table_header');

var _table_body = require('../table/table_body');

var _table_row_cell_checkbox = require('../table/table_row_cell_checkbox');

var _button_icon = require('../button/button_icon/button_icon');

var _icon = require('../icon');

var _collapsed_item_actions = require('./collapsed_item_actions');

var _expanded_item_actions = require('./expanded_item_actions');

var _table_row_cell = require('../table/table_row_cell');

var _table_row = require('../table/table_row');

var _pagination_bar = require('./pagination_bar');

var _icon2 = require('../icon/icon');

var _loading_table_body = require('./loading_table_body');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dataTypesProfiles = {
  auto: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatAuto)(value);
    }
  },
  string: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatText)(value);
    }
  },
  number: {
    align: _services.RIGHT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatNumber)(value);
    }
  },
  boolean: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatBoolean)(value);
    }
  },
  date: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatDate)(value);
    }
  }
};

var DATA_TYPES = Object.keys(dataTypesProfiles);

var DefaultItemActionType = _propTypes2.default.shape({
  type: _propTypes2.default.oneOf(['icon', 'button']), // default is 'button'
  name: _propTypes2.default.string.isRequired,
  description: _propTypes2.default.string.isRequired,
  onClick: _propTypes2.default.func.isRequired, // (item) => void,
  available: _propTypes2.default.func, // (item) => boolean;
  enabled: _propTypes2.default.func, // (item) => boolean;
  icon: _propTypes2.default.oneOfType([// required when type is 'icon'
  _propTypes2.default.oneOf(_icon.ICON_TYPES), _propTypes2.default.func // (item) => oneOf(ICON_TYPES)
  ]),
  color: _propTypes2.default.oneOfType([_propTypes2.default.oneOf(_button_icon.COLORS), _propTypes2.default.func // (item) => oneOf(ICON_BUTTON_COLORS)
  ])
});

var CustomItemActionType = _propTypes2.default.shape({
  render: _propTypes2.default.func.isRequired, // (item, enabled) => PropTypes.node;
  available: _propTypes2.default.func, // (item) => boolean;
  enabled: _propTypes2.default.func // (item) => boolean;
});

var SupportedItemActionType = _propTypes2.default.oneOfType([DefaultItemActionType, CustomItemActionType]);

var ActionsColumnType = _propTypes2.default.shape({
  actions: _propTypes2.default.arrayOf(SupportedItemActionType).isRequired,
  name: _propTypes2.default.string,
  description: _propTypes2.default.string,
  width: _propTypes2.default.string
});

var FieldDataColumnType = exports.FieldDataColumnType = _propTypes2.default.shape({
  field: _propTypes2.default.string.isRequired,
  name: _propTypes2.default.string.isRequired,
  description: _propTypes2.default.string,
  dataType: _propTypes2.default.oneOf(DATA_TYPES),
  width: _propTypes2.default.string,
  sortable: _propTypes2.default.bool,
  align: _propTypes2.default.oneOf([_services.LEFT_ALIGNMENT, _services.RIGHT_ALIGNMENT]),
  truncateText: _propTypes2.default.bool,
  render: _propTypes2.default.func // ((value, record) => PropTypes.node (also see [services/value_renderer] for basic implementations)
});

var ComputedColumnType = exports.ComputedColumnType = _propTypes2.default.shape({
  render: _propTypes2.default.func.isRequired, // (record) => PropTypes.node
  name: _propTypes2.default.string,
  description: _propTypes2.default.string,
  width: _propTypes2.default.string,
  truncateText: _propTypes2.default.bool
});

var ColumnType = exports.ColumnType = _propTypes2.default.oneOfType([FieldDataColumnType, ComputedColumnType, ActionsColumnType]);

var ItemIdType = _propTypes2.default.oneOfType([_propTypes2.default.string, // the name of the item id property
_propTypes2.default.func // (item) => string
]);

var SelectionType = exports.SelectionType = _propTypes2.default.shape({
  itemId: ItemIdType.isRequired,
  onSelectionChange: _propTypes2.default.func, // (selection: Record[]) => void;,
  selectable: _propTypes2.default.func, // (item) => boolean;
  selectableMessage: _propTypes2.default.func // (selectable, item) => boolean;
});

var SortingType = _propTypes2.default.shape({
  sort: _services.PropertySortType
});

var BasicTablePropTypes = {
  items: _propTypes2.default.array.isRequired,
  columns: _propTypes2.default.arrayOf(ColumnType).isRequired,
  pagination: _pagination_bar.PaginationType,
  sorting: SortingType,
  selection: SelectionType,
  onChange: _propTypes2.default.func,
  error: _propTypes2.default.string,
  loading: _propTypes2.default.bool,
  noItemsMessage: _propTypes2.default.node,
  className: _propTypes2.default.string
};

var EuiBasicTable = exports.EuiBasicTable = function (_Component) {
  _inherits(EuiBasicTable, _Component);

  function EuiBasicTable(props) {
    _classCallCheck(this, EuiBasicTable);

    var _this = _possibleConstructorReturn(this, (EuiBasicTable.__proto__ || Object.getPrototypeOf(EuiBasicTable)).call(this, props));

    _this.state = {
      hoverRow: null,
      selection: []
    };
    return _this;
  }

  _createClass(EuiBasicTable, [{
    key: 'itemId',
    value: function itemId(item) {
      var selection = this.props.selection;

      if (selection) {
        if ((0, _predicate.isFunction)(selection.itemId)) {
          return selection.itemId(item);
        }
        return item[selection.itemId];
      }
    }
  }, {
    key: 'changeSelection',
    value: function changeSelection(selection) {
      if (!this.props.selection) {
        return;
      }
      this.setState({ selection: selection });
      if (this.props.selection.onSelectionChange) {
        this.props.selection.onSelectionChange(selection);
      }
    }
  }, {
    key: 'clearSelection',
    value: function clearSelection() {
      this.changeSelection([]);
    }
  }, {
    key: 'onPageSizeChange',
    value: function onPageSizeChange(size) {
      this.clearSelection();
      var currentCriteria = EuiBasicTable.buildCriteria(this.props);
      var criteria = _extends({}, currentCriteria, {
        page: {
          index: 0, // when page size changes, we take the user back to the first page
          size: size
        }
      });
      this.props.onChange(criteria);
    }
  }, {
    key: 'onPageChange',
    value: function onPageChange(index) {
      this.clearSelection();
      var currentCriteria = EuiBasicTable.buildCriteria(this.props);
      var criteria = _extends({}, currentCriteria, {
        page: _extends({}, currentCriteria.page, {
          index: index
        })
      });
      this.props.onChange(criteria);
    }
  }, {
    key: 'onColumnSortChange',
    value: function onColumnSortChange(column) {
      this.clearSelection();
      var currentCriteria = EuiBasicTable.buildCriteria(this.props);
      var direction = _services.SortDirection.ASC;
      if (currentCriteria && currentCriteria.sort && currentCriteria.sort.field === column.field) {
        direction = _services.SortDirection.reverse(currentCriteria.sort.direction);
      }
      var criteria = _extends({}, currentCriteria, {
        // resetting the page if the criteria has one
        page: !currentCriteria.page ? undefined : {
          index: 0,
          size: currentCriteria.page.size
        },
        sort: {
          field: column.field,
          direction: direction
        }
      });
      this.props.onChange(criteria);
    }
  }, {
    key: 'onRowHover',
    value: function onRowHover(row) {
      this.setState({ hoverRow: row });
    }
  }, {
    key: 'clearRowHover',
    value: function clearRowHover() {
      this.setState({ hoverRow: null });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      // Don't call changeSelection here or else we can get into an infinite loop:
      // changeSelection calls props.onSelectionChanged on owner ->
      // owner may react by changing props ->
      // we receive new props, calling componentWillReceiveProps ->
      // and we're in an infinite loop
      if (!this.props.selection) {
        return;
      }

      if (!nextProps.selection) {
        this.setState({ selection: [] });
        return;
      }

      this.setState(function (prevState) {
        var selection = prevState.selection.filter(function (selectedItem) {
          return nextProps.items.findIndex(function (item) {
            return _this2.itemId(item) === _this2.itemId(selectedItem);
          }) !== -1;
        });
        return { selection: selection };
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          loading = _props.loading;


      var classes = (0, _classnames2.default)('euiBasicTable', {
        'euiBasicTable-loading': loading
      }, className);

      var table = this.renderTable();
      var paginationBar = this.renderPaginationBar();

      return _react2.default.createElement(
        'div',
        { className: classes },
        table,
        paginationBar
      );
    }
  }, {
    key: 'renderTable',
    value: function renderTable() {
      var head = this.renderTableHead();
      var body = this.renderTableBody();
      return _react2.default.createElement(
        _table.EuiTable,
        null,
        head,
        body
      );
    }
  }, {
    key: 'renderTableHead',
    value: function renderTableHead() {
      var _this3 = this;

      var _props2 = this.props,
          items = _props2.items,
          columns = _props2.columns,
          selection = _props2.selection;


      var headers = [];

      if (selection) {
        var selectableItems = items.filter(function (item) {
          return !selection.selectable || selection.selectable(item);
        });

        var checked = this.state.selection && selectableItems.length > 0 && this.state.selection.length === selectableItems.length;

        var disabled = selectableItems.length === 0;

        var onChange = function onChange(event) {
          if (event.target.checked) {
            _this3.changeSelection(selectableItems);
          } else {
            _this3.changeSelection([]);
          }
        };

        headers.push(_react2.default.createElement(
          _table_header_cell_checkbox.EuiTableHeaderCellCheckbox,
          { key: '_selection_column_h', width: '24px' },
          _react2.default.createElement(_checkbox.EuiCheckbox, {
            id: '_selection_column-checkbox',
            type: 'inList',
            checked: checked,
            disabled: disabled,
            onChange: onChange,
            'data-test-subj': 'checkboxSelectAll'
          })
        ));
      }

      columns.forEach(function (column, index) {
        // actions column
        if (column.actions) {
          headers.push(_react2.default.createElement(
            _table_header_cell.EuiTableHeaderCell,
            {
              key: '_actions_h_' + index,
              align: 'right',
              width: column.width
            },
            column.name
          ));
          return;
        }

        var align = _this3.resolveColumnAlign(column);

        // computed column
        if (!column.field) {
          headers.push(_react2.default.createElement(
            _table_header_cell.EuiTableHeaderCell,
            {
              key: '_computed_column_h_' + index,
              align: align,
              width: column.width
            },
            column.name
          ));
          return;
        }

        // field data column
        var sorting = {};
        if (_this3.props.sorting && column.sortable) {
          var sortDirection = _this3.resolveColumnSortDirection(column);
          sorting.isSorted = !!sortDirection;
          sorting.isSortAscending = sortDirection ? _services.SortDirection.isAsc(sortDirection) : undefined;
          sorting.onSort = _this3.resolveColumnOnSort(column);
        }
        headers.push(_react2.default.createElement(
          _table_header_cell.EuiTableHeaderCell,
          _extends({
            key: '_data_h_' + column.field + '_' + index,
            align: align,
            width: column.width
          }, sorting),
          column.name
        ));
      });

      return _react2.default.createElement(
        _table_header.EuiTableHeader,
        null,
        headers
      );
    }
  }, {
    key: 'renderTableBody',
    value: function renderTableBody() {
      var _this4 = this;

      if (this.props.error) {
        return this.renderErrorBody(this.props.error);
      }
      var items = this.props.items;

      if (items.length === 0) {
        return this.renderEmptyBody();
      }
      var rows = items.map(function (item, index) {
        return _this4.renderItemRow(item, index);
      });
      if (this.props.loading) {
        return _react2.default.createElement(
          _loading_table_body.LoadingTableBody,
          null,
          rows
        );
      }
      return _react2.default.createElement(
        _table_body.EuiTableBody,
        null,
        rows
      );
    }
  }, {
    key: 'renderErrorBody',
    value: function renderErrorBody(error) {
      var colSpan = this.props.columns.length + (this.props.selection ? 1 : 0);
      return _react2.default.createElement(
        _table_body.EuiTableBody,
        null,
        _react2.default.createElement(
          _table_row.EuiTableRow,
          null,
          _react2.default.createElement(
            _table_row_cell.EuiTableRowCell,
            { align: 'center', colSpan: colSpan },
            _react2.default.createElement(_icon2.EuiIcon, { type: 'minusInCircle', color: 'danger' }),
            ' ',
            error
          )
        )
      );
    }
  }, {
    key: 'renderEmptyBody',
    value: function renderEmptyBody() {
      var _props3 = this.props,
          columns = _props3.columns,
          selection = _props3.selection,
          noItemsMessage = _props3.noItemsMessage;

      var colSpan = columns.length + (selection ? 1 : 0);
      return _react2.default.createElement(
        _table_body.EuiTableBody,
        null,
        _react2.default.createElement(
          _table_row.EuiTableRow,
          null,
          _react2.default.createElement(
            _table_row_cell.EuiTableRowCell,
            { align: 'center', colSpan: colSpan },
            noItemsMessage
          )
        )
      );
    }
  }, {
    key: 'renderItemRow',
    value: function renderItemRow(item, rowIndex) {
      var _this5 = this;

      var _props4 = this.props,
          columns = _props4.columns,
          selection = _props4.selection,
          itemIdToExpandedRowMap = _props4.itemIdToExpandedRowMap;


      var cells = [];

      var itemId = selection ? this.itemId(item) : rowIndex;
      var selected = !selection ? false : this.state.selection && !!this.state.selection.find(function (selectedRecord) {
        return _this5.itemId(selectedRecord) === itemId;
      });

      if (selection) {
        cells.push(this.renderItemSelectionCell(itemId, item, selected));
      }

      columns.forEach(function (column, columnIndex) {
        if (column.actions) {
          cells.push(_this5.renderItemActionsCell(itemId, item, column, columnIndex, rowIndex));
        } else if (column.field) {
          cells.push(_this5.renderItemFieldDataCell(itemId, item, column, columnIndex));
        } else {
          cells.push(_this5.renderItemComputedCell(itemId, item, column, columnIndex));
        }
      });

      var onMouseOver = function onMouseOver() {
        return _this5.onRowHover(rowIndex);
      };
      var onMouseOut = function onMouseOut() {
        return _this5.clearRowHover();
      };

      // Occupy full width of table, taking checkbox column into account.
      var expandedRowColSpan = selection ? columns.length + 1 : columns.length;
      // We'll use the ID to associate the expanded row with the original.
      var expandedRowId = 'row_' + itemId + '_expansion';
      var expandedRow = itemIdToExpandedRowMap[itemId] ? _react2.default.createElement(
        _table_row.EuiTableRow,
        { id: expandedRowId, key: expandedRowId },
        _react2.default.createElement(
          _table_row_cell.EuiTableRowCell,
          { colSpan: expandedRowColSpan },
          itemIdToExpandedRowMap[itemId]
        )
      ) : undefined;

      return _react2.default.createElement(
        _react.Fragment,
        { key: 'row_' + itemId },
        _react2.default.createElement(
          _table_row.EuiTableRow,
          {
            'aria-owns': expandedRowId,
            isSelected: selected,
            onMouseOver: onMouseOver,
            onMouseOut: onMouseOut
          },
          cells
        ),
        expandedRow
      );
    }
  }, {
    key: 'renderItemSelectionCell',
    value: function renderItemSelectionCell(itemId, item, selected) {
      var _this6 = this;

      var selection = this.props.selection;

      var key = '_selection_column_' + itemId;
      var checked = selected;
      var disabled = selection.selectable && !selection.selectable(item);
      var title = selection.selectableMessage && selection.selectableMessage(!disabled, item);
      var onChange = function onChange(event) {
        if (event.target.checked) {
          _this6.changeSelection([].concat(_toConsumableArray(_this6.state.selection), [item]));
        } else {
          _this6.changeSelection(_this6.state.selection.reduce(function (selection, selectedItem) {
            if (_this6.itemId(selectedItem) !== itemId) {
              selection.push(selectedItem);
            }
            return selection;
          }, []));
        }
      };
      return _react2.default.createElement(
        _table_row_cell_checkbox.EuiTableRowCellCheckbox,
        { key: key },
        _react2.default.createElement(_checkbox.EuiCheckbox, {
          id: key + '-checkbox',
          type: 'inList',
          disabled: disabled,
          checked: checked,
          onChange: onChange,
          title: title,
          'data-test-subj': 'checkboxSelectRow-' + itemId
        })
      );
    }
  }, {
    key: 'renderItemActionsCell',
    value: function renderItemActionsCell(itemId, item, column, columnIndex, rowIndex) {
      var _this7 = this;

      var visible = this.state.hoverRow === rowIndex;

      var actionEnabled = function actionEnabled(action) {
        return _this7.state.selection.length === 0 && (!action.enabled || action.enabled(item));
      };

      var actualActions = column.actions;
      if (column.actions.length > 1) {

        // if we have more than 1 action, we don't show them all in the cell, instead we
        // put them all in a popover tool. This effectively means we can only have a maximum
        // of one tool per row (it's either and normal action, or it's a popover that shows multiple actions)
        //
        // here we create a single custom action that triggers the popover with all the configured actions

        actualActions = [{
          name: 'Actions',
          render: function render(item) {
            return _react2.default.createElement(_collapsed_item_actions.CollapsedItemActions, {
              actions: column.actions,
              visible: visible,
              itemId: itemId,
              item: item,
              actionEnabled: actionEnabled
            });
          }
        }];
      }

      var tools = _react2.default.createElement(_expanded_item_actions.ExpandedItemActions, {
        actions: actualActions,
        visible: visible,
        itemId: itemId,
        item: item,
        actionEnabled: actionEnabled
      });

      var key = 'record_actions_' + itemId + '_' + columnIndex;
      return _react2.default.createElement(
        _table_row_cell.EuiTableRowCell,
        { key: key, align: 'right', textOnly: false },
        tools
      );
    }
  }, {
    key: 'renderItemFieldDataCell',
    value: function renderItemFieldDataCell(itemId, item, column, columnIndex) {
      var field = column.field,
          render = column.render,
          textOnly = column.textOnly,
          name = column.name,
          description = column.description,
          dataType = column.dataType,
          sortable = column.sortable,
          rest = _objectWithoutProperties(column, ['field', 'render', 'textOnly', 'name', 'description', 'dataType', 'sortable']);

      var key = '_data_column_' + field + '_' + itemId + '_' + columnIndex;
      var align = this.resolveColumnAlign(column);
      var value = (0, _objects.get)(item, field);
      var contentRenderer = this.resolveContentRenderer(column);
      var content = contentRenderer(value, item);
      return _react2.default.createElement(
        _table_row_cell.EuiTableRowCell,
        _extends({
          key: key,
          align: align
          // If there's no render function defined then we're only going to render text.
          , textOnly: textOnly || !render
        }, rest),
        content
      );
    }
  }, {
    key: 'renderItemComputedCell',
    value: function renderItemComputedCell(itemId, item, column, columnIndex) {
      var field = column.field,
          render = column.render,
          name = column.name,
          description = column.description,
          dataType = column.dataType,
          sortable = column.sortable,
          rest = _objectWithoutProperties(column, ['field', 'render', 'name', 'description', 'dataType', 'sortable']);

      var key = '_computed_column_' + itemId + '_' + columnIndex;
      var align = this.resolveColumnAlign(column);
      var contentRenderer = this.resolveContentRenderer(column);
      var content = contentRenderer(item);
      return _react2.default.createElement(
        _table_row_cell.EuiTableRowCell,
        _extends({
          key: key,
          align: align
        }, rest),
        content
      );
    }
  }, {
    key: 'resolveColumnAlign',
    value: function resolveColumnAlign(column) {
      if (column.align) {
        return column.align;
      }
      var dataType = column.dataType || 'auto';
      var profile = dataTypesProfiles[dataType];
      if (!profile) {
        throw new Error('Unknown dataType [' + dataType + ']. The supported data types are [' + DATA_TYPES.join(', ') + ']');
      }
      return profile.align;
    }
  }, {
    key: 'resolveColumnSortDirection',
    value: function resolveColumnSortDirection(column) {
      var sorting = this.props.sorting;

      if (!sorting || !sorting.sort || !column.sortable) {
        return;
      }
      if (sorting.sort.field === column.field) {
        return sorting.sort.direction;
      }
    }
  }, {
    key: 'resolveColumnOnSort',
    value: function resolveColumnOnSort(column) {
      var _this8 = this;

      var sorting = this.props.sorting;

      if (!sorting || !column.sortable) {
        return;
      }
      if (!this.props.onChange) {
        throw new Error('BasicTable is configured to be sortable on column [' + column.field + '] but\n          [onChange] is not configured. This callback must be implemented to handle the sort requests');
      }
      return function () {
        return _this8.onColumnSortChange(column);
      };
    }
  }, {
    key: 'resolveContentRenderer',
    value: function resolveContentRenderer(column) {
      if (column.render) {
        return column.render;
      }
      var dataType = column.dataType || 'auto';
      var profile = dataTypesProfiles[dataType];
      if (!profile) {
        throw new Error('Unknown dataType [' + dataType + ']. The supported data types are [' + DATA_TYPES.join(', ') + ']');
      }
      return profile.render;
    }
  }, {
    key: 'renderPaginationBar',
    value: function renderPaginationBar() {
      var _props5 = this.props,
          error = _props5.error,
          pagination = _props5.pagination,
          onChange = _props5.onChange;

      if (!error && pagination) {
        if (!onChange) {
          throw new Error('The Basic Table is configured with pagination but [onChange] is\n        not configured. This callback must be implemented to handle pagination changes');
        }
        return _react2.default.createElement(_pagination_bar.PaginationBar, {
          pagination: pagination,
          onPageSizeChange: this.onPageSizeChange.bind(this),
          onPageChange: this.onPageChange.bind(this)
        });
      }
    }
  }], [{
    key: 'buildCriteria',
    value: function buildCriteria(props) {
      var criteria = {};
      if (props.pagination) {
        criteria.page = {
          index: props.pagination.pageIndex,
          size: props.pagination.pageSize
        };
      }
      if (props.sorting) {
        criteria.sort = props.sorting.sort;
      }
      return criteria;
    }
  }]);

  return EuiBasicTable;
}(_react.Component);

EuiBasicTable.propTypes = BasicTablePropTypes;
EuiBasicTable.defaultProps = {
  noItemsMessage: 'No items found',
  itemIdToExpandedRowMap: {}
};
EuiBasicTable.__docgenInfo = [{
  'description': '',
  'displayName': 'EuiBasicTable',
  'methods': [{
    'name': 'buildCriteria',
    'docblock': null,
    'modifiers': ['static'],
    'params': [{
      'name': 'props',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'itemId',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'item',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'changeSelection',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'selection',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'clearSelection',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'onPageSizeChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'size',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onPageChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'index',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onColumnSortChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'column',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onRowHover',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'row',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'clearRowHover',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'renderTable',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'renderTableHead',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'renderTableBody',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'renderErrorBody',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'error',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderEmptyBody',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'renderItemRow',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'item',
      'type': null
    }, {
      'name': 'rowIndex',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderItemSelectionCell',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'itemId',
      'type': null
    }, {
      'name': 'item',
      'type': null
    }, {
      'name': 'selected',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderItemActionsCell',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'itemId',
      'type': null
    }, {
      'name': 'item',
      'type': null
    }, {
      'name': 'column',
      'type': null
    }, {
      'name': 'columnIndex',
      'type': null
    }, {
      'name': 'rowIndex',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderItemFieldDataCell',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'itemId',
      'type': null
    }, {
      'name': 'item',
      'type': null
    }, {
      'name': 'column',
      'type': null
    }, {
      'name': 'columnIndex',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderItemComputedCell',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'itemId',
      'type': null
    }, {
      'name': 'item',
      'type': null
    }, {
      'name': 'column',
      'type': null
    }, {
      'name': 'columnIndex',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'resolveColumnAlign',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'column',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'resolveColumnSortDirection',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'column',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'resolveColumnOnSort',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'column',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'resolveContentRenderer',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'column',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'renderPaginationBar',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }],
  'props': {
    'items': {
      'type': {
        'name': 'array'
      },
      'required': true,
      'description': ''
    },
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
    'pagination': {
      'type': {
        'name': 'custom',
        'raw': 'PaginationType'
      },
      'required': false,
      'description': ''
    },
    'sorting': {
      'type': {
        'name': 'custom',
        'raw': 'SortingType'
      },
      'required': false,
      'description': ''
    },
    'selection': {
      'type': {
        'name': 'custom',
        'raw': 'SelectionType'
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
    'error': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'loading': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    },
    'noItemsMessage': {
      'type': {
        'name': 'node'
      },
      'required': false,
      'description': '',
      'defaultValue': {
        'value': '\'No items found\'',
        'computed': false
      }
    },
    'className': {
      'type': {
        'name': 'string'
      },
      'required': false,
      'description': ''
    },
    'itemIdToExpandedRowMap': {
      'defaultValue': {
        'value': '{}',
        'computed': false
      }
    }
  }
}];