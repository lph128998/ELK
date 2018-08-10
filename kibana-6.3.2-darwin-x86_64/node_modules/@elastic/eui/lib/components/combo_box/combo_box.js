'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiComboBox = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _tabbable = require('tabbable');

var _tabbable2 = _interopRequireDefault(_tabbable);

var _services = require('../../services');

var _key_codes = require('../../services/key_codes');

var _portal = require('../portal');

var _combo_box_input = require('./combo_box_input');

var _combo_box_options_list = require('./combo_box_options_list');

var _matching_options = require('./matching_options');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Elements within EuiComboBox which would normally be tabbable (inputs, buttons) have been removed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * from the tab order with tabindex="-1" so that we can control the keyboard navigation interface.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var EuiComboBox = exports.EuiComboBox = function (_Component) {
  _inherits(EuiComboBox, _Component);

  function EuiComboBox(props) {
    _classCallCheck(this, EuiComboBox);

    var _this = _possibleConstructorReturn(this, (EuiComboBox.__proto__ || Object.getPrototypeOf(EuiComboBox)).call(this, props));

    _initialiseProps.call(_this);

    var initialSearchValue = '';
    var options = props.options,
        selectedOptions = props.selectedOptions;

    var _this$getMatchingOpti = _this.getMatchingOptions(options, selectedOptions, initialSearchValue),
        matchingOptions = _this$getMatchingOpti.matchingOptions,
        optionToGroupMap = _this$getMatchingOpti.optionToGroupMap;

    _this.state = {
      searchValue: initialSearchValue,
      isListOpen: false,
      listPosition: 'bottom'
    };

    // Cached derived state.
    _this.matchingOptions = matchingOptions;
    _this.optionToGroupMap = optionToGroupMap;
    _this.activeOptionIndex = undefined;
    _this.listBounds = undefined;

    // Refs.
    _this.comboBox = undefined;
    _this.autoSizeInput = undefined;
    _this.searchInput = undefined;
    _this.optionsList = undefined;
    _this.options = [];
    return _this;
  }

  _createClass(EuiComboBox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // TODO: This will need to be called once the actual stylesheet loads.
      setTimeout(function () {
        _this2.autoSizeInput.copyInputStyles();
      }, 100);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var options = nextProps.options,
          selectedOptions = nextProps.selectedOptions;
      var searchValue = nextState.searchValue;


      if (options !== this.props.options || selectedOptions !== this.props.selectedOptions || searchValue !== this.props.searchValue) {
        // Clear refs to options if the ones we can display changes.
        this.options = [];
      }

      // Calculate and cache the options which match the searchValue, because we use this information
      // in multiple places and it would be expensive to calculate repeatedly.

      var _getMatchingOptions = this.getMatchingOptions(options, selectedOptions, nextState.searchValue),
          matchingOptions = _getMatchingOptions.matchingOptions,
          optionToGroupMap = _getMatchingOptions.optionToGroupMap;

      this.matchingOptions = matchingOptions;
      this.optionToGroupMap = optionToGroupMap;

      if (!matchingOptions.length) {
        this.clearActiveOption();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.focusActiveOption();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.onDocumentFocusChange);
      document.removeEventListener('focusin', this.onDocumentFocusChange);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          className = _props.className,
          isLoading = _props.isLoading,
          options = _props.options,
          selectedOptions = _props.selectedOptions,
          onCreateOption = _props.onCreateOption,
          placeholder = _props.placeholder,
          noSuggestions = _props.noSuggestions,
          renderOption = _props.renderOption,
          singleSelection = _props.singleSelection,
          onChange = _props.onChange,
          onSearchChange = _props.onSearchChange,
          async = _props.async,
          isInvalid = _props.isInvalid,
          rest = _objectWithoutProperties(_props, ['id', 'className', 'isLoading', 'options', 'selectedOptions', 'onCreateOption', 'placeholder', 'noSuggestions', 'renderOption', 'singleSelection', 'onChange', 'onSearchChange', 'async', 'isInvalid']);

      var _state = this.state,
          searchValue = _state.searchValue,
          isListOpen = _state.isListOpen,
          listPosition = _state.listPosition;


      var classes = (0, _classnames2.default)('euiComboBox', className, {
        'euiComboBox-isOpen': isListOpen,
        'euiComboBox-isInvalid': isInvalid
      });

      var value = selectedOptions.map(function (selectedOption) {
        return selectedOption.label;
      }).join(', ');

      var optionsList = void 0;

      if (!noSuggestions && isListOpen) {
        optionsList = _react2.default.createElement(
          _portal.EuiPortal,
          null,
          _react2.default.createElement(_combo_box_options_list.EuiComboBoxOptionsList, {
            isLoading: isLoading,
            options: options,
            selectedOptions: selectedOptions,
            onCreateOption: onCreateOption,
            searchValue: searchValue,
            matchingOptions: this.matchingOptions,
            optionToGroupMap: this.optionToGroupMap,
            listRef: this.optionsListRef,
            optionRef: this.optionRef,
            onOptionClick: this.onOptionClick,
            onOptionEnterKey: this.onOptionEnterKey,
            areAllOptionsSelected: this.areAllOptionsSelected(),
            getSelectedOptionForSearchValue: _matching_options.getSelectedOptionForSearchValue,
            updatePosition: this.updateListPosition,
            position: listPosition,
            renderOption: renderOption
          })
        );
      }

      return _react2.default.createElement(
        'div',
        _extends({
          className: classes,
          onFocus: this.onComboBoxFocus,
          onKeyDown: this.onKeyDown,
          ref: this.comboBoxRef
        }, rest),
        _react2.default.createElement(_combo_box_input.EuiComboBoxInput, {
          id: id,
          placeholder: placeholder,
          selectedOptions: selectedOptions,
          onRemoveOption: this.onRemoveOption,
          onClick: this.onComboBoxClick,
          onChange: this.onSearchChange,
          onFocus: this.onFocus,
          value: value,
          searchValue: searchValue,
          autoSizeInputRef: this.autoSizeInputRef,
          inputRef: this.searchInputRef,
          updatePosition: this.updateListPosition
        }),
        optionsList
      );
    }
  }]);

  return EuiComboBox;
}(_react.Component);

EuiComboBox.propTypes = {
  id: _propTypes2.default.string,
  className: _propTypes2.default.string,
  placeholder: _propTypes2.default.string,
  isLoading: _propTypes2.default.bool,
  async: _propTypes2.default.bool,
  singleSelection: _propTypes2.default.bool,
  noSuggestions: _propTypes2.default.bool,
  options: _propTypes2.default.array,
  selectedOptions: _propTypes2.default.array,
  onChange: _propTypes2.default.func,
  onSearchChange: _propTypes2.default.func,
  onCreateOption: _propTypes2.default.func,
  renderOption: _propTypes2.default.func,
  isInvalid: _propTypes2.default.bool
};
EuiComboBox.defaultProps = {
  options: [],
  selectedOptions: []
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.getMatchingOptions = function (options, selectedOptions, searchValue) {
    // Assume the consumer has already filtered the options against the search value.
    var isPreFiltered = _this3.props.async;
    return (0, _matching_options.getMatchingOptions)(options, selectedOptions, searchValue, isPreFiltered);
  };

  this.openList = function () {
    _this3.setState({
      isListOpen: true
    });
  };

  this.closeList = function () {
    _this3.clearActiveOption();
    _this3.setState({
      isListOpen: false
    });
  };

  this.updateListPosition = function () {
    var listBounds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.listBounds;

    if (!_this3.state.isListOpen) {
      return;
    }

    if (!listBounds) {
      return;
    }

    var comboBoxBounds = _this3.comboBox.getBoundingClientRect();

    // Cache for future calls. Assign values directly instead of destructuring because listBounds is
    // a DOMRect, not a JS object.
    _this3.listBounds = {
      bottom: listBounds.bottom,
      height: listBounds.height,
      left: comboBoxBounds.left,
      right: comboBoxBounds.right,
      top: listBounds.top,
      width: comboBoxBounds.width,
      x: listBounds.x,
      y: listBounds.y
    };

    var _calculatePopoverPosi = (0, _services.calculatePopoverPosition)(comboBoxBounds, _this3.listBounds, 'bottom', 0, ['bottom', 'top']),
        position = _calculatePopoverPosi.position,
        left = _calculatePopoverPosi.left,
        top = _calculatePopoverPosi.top;

    _this3.optionsList.style.top = top + window.scrollY + 'px';
    _this3.optionsList.style.left = left + 'px';
    _this3.optionsList.style.width = comboBoxBounds.width + 'px';

    _this3.setState({
      listPosition: position
    });
  };

  this.tabAway = function (amount) {
    var tabbableItems = (0, _tabbable2.default)(document);
    var comboBoxIndex = tabbableItems.indexOf(_this3.searchInput);

    // Wrap to last tabbable if tabbing backwards.
    if (amount < 0) {
      if (comboBoxIndex === 0) {
        tabbableItems[tabbableItems.length - 1].focus();
        return;
      }
    }

    // Wrap to first tabbable if tabbing forwards.
    if (amount > 0) {
      if (comboBoxIndex === tabbableItems.length - 1) {
        tabbableItems[0].focus();
        return;
      }
    }

    tabbableItems[comboBoxIndex + amount].focus();
  };

  this.incrementActiveOptionIndex = function (amount) {
    // If there are no options available, reset the focus.
    if (!_this3.matchingOptions.length) {
      _this3.clearActiveOption();
      return;
    }

    var nextActiveOptionIndex = void 0;

    if (!_this3.hasActiveOption()) {
      // If this is the beginning of the user's keyboard navigation of the menu, then we'll focus
      // either the first or last item.
      nextActiveOptionIndex = amount < 0 ? _this3.options.length - 1 : 0;
    } else {
      nextActiveOptionIndex = _this3.activeOptionIndex + amount;

      if (nextActiveOptionIndex < 0) {
        nextActiveOptionIndex = _this3.options.length - 1;
      } else if (nextActiveOptionIndex === _this3.options.length) {
        nextActiveOptionIndex = 0;
      }
    }

    _this3.activeOptionIndex = nextActiveOptionIndex;
    _this3.focusActiveOption();
  };

  this.hasActiveOption = function () {
    return _this3.activeOptionIndex !== undefined;
  };

  this.clearActiveOption = function () {
    _this3.activeOptionIndex = undefined;
  };

  this.focusActiveOption = function () {
    // If an item is focused, focus it.
    if (_this3.hasActiveOption()) {
      _this3.options[_this3.activeOptionIndex].focus();
    }
  };

  this.focusSearchInput = function () {
    _this3.clearActiveOption();
    _this3.searchInput.focus();
  };

  this.clearSearchValue = function () {
    _this3.onSearchChange('');
  };

  this.removeLastOption = function () {
    if (_this3.hasActiveOption()) {
      return;
    }

    if (!_this3.props.selectedOptions.length) {
      return;
    }

    // Backspace will be used to delete the input, not a pill.
    if (_this3.state.searchValue.length) {
      return;
    }

    // Delete last pill.
    _this3.onRemoveOption(_this3.props.selectedOptions[_this3.props.selectedOptions.length - 1]);
  };

  this.addCustomOption = function () {
    if (_this3.doesSearchMatchOnlyOption()) {
      _this3.options[0].click();
      return;
    }

    if (!_this3.props.onCreateOption) {
      return;
    }

    // Don't create the value if it's already been selected.
    if ((0, _matching_options.getSelectedOptionForSearchValue)(_this3.state.searchValue, _this3.props.selectedOptions)) {
      return;
    }

    // Add new custom pill if this is custom input, even if it partially matches an option..
    if (!_this3.hasActiveOption() || _this3.doesSearchMatchOnlyOption()) {
      var isOptionCreated = _this3.props.onCreateOption(_this3.state.searchValue, (0, _matching_options.flattenOptionGroups)(_this3.props.options));

      // Expect the consumer to be explicit in rejecting a custom option.
      if (isOptionCreated === false) {
        return;
      }

      _this3.clearSearchValue();
    }
  };

  this.doesSearchMatchOnlyOption = function () {
    var searchValue = _this3.state.searchValue;

    if (_this3.matchingOptions.length !== 1) {
      return false;
    }
    return _this3.matchingOptions[0].label.toLowerCase() === searchValue.toLowerCase();
  };

  this.areAllOptionsSelected = function () {
    var _props2 = _this3.props,
        options = _props2.options,
        selectedOptions = _props2.selectedOptions,
        async = _props2.async;
    // Assume if this is async then there could be infinite options.

    if (async) {
      return false;
    }
    return (0, _matching_options.flattenOptionGroups)(options).length === selectedOptions.length;
  };

  this.onFocus = function () {
    document.addEventListener('click', _this3.onDocumentFocusChange);
    document.addEventListener('focusin', _this3.onDocumentFocusChange);
    _this3.openList();
  };

  this.onBlur = function () {
    document.removeEventListener('click', _this3.onDocumentFocusChange);
    document.removeEventListener('focusin', _this3.onDocumentFocusChange);
    _this3.closeList();
  };

  this.onDocumentFocusChange = function (event) {
    // Close the list if the combo box has lost focus.
    if (_this3.comboBox === event.target || _this3.comboBox.contains(event.target) || _this3.optionsList === event.target || _this3.optionsList && _this3.optionsList.contains(event.target)) {
      return;
    }

    // Wait for the DOM to update.
    requestAnimationFrame(function () {
      if (document.activeElement === _this3.searchInput) {
        return;
      }

      _this3.onBlur();
    });
  };

  this.onKeyDown = function (e) {
    switch (e.keyCode) {
      case _services.comboBoxKeyCodes.UP:
        e.preventDefault();
        _this3.incrementActiveOptionIndex(-1);
        break;

      case _services.comboBoxKeyCodes.DOWN:
        e.preventDefault();
        _this3.incrementActiveOptionIndex(1);
        break;

      case _key_codes.BACKSPACE:
        _this3.removeLastOption();
        break;

      case _key_codes.ESCAPE:
        // Move focus from options list to input.
        if (_this3.hasActiveOption()) {
          _this3.focusSearchInput();
        }
        break;

      case _services.comboBoxKeyCodes.ENTER:
        _this3.addCustomOption();
        break;

      case _key_codes.TAB:
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
          _this3.tabAway(-1);
        } else {
          _this3.tabAway(1);
        }
        break;
    }
  };

  this.onOptionEnterKey = function (option) {
    _this3.onAddOption(option);
  };

  this.onOptionClick = function (option) {
    _this3.onAddOption(option);
  };

  this.onAddOption = function (addedOption) {
    var _props3 = _this3.props,
        onChange = _props3.onChange,
        selectedOptions = _props3.selectedOptions,
        singleSelection = _props3.singleSelection;

    onChange(singleSelection ? [addedOption] : selectedOptions.concat(addedOption));
    _this3.clearSearchValue();
    _this3.focusSearchInput();
  };

  this.onRemoveOption = function (removedOption) {
    var _props4 = _this3.props,
        onChange = _props4.onChange,
        selectedOptions = _props4.selectedOptions;

    onChange(selectedOptions.filter(function (option) {
      return option !== removedOption;
    }));
    _this3.focusSearchInput();
  };

  this.onComboBoxClick = function () {
    // When the user clicks anywhere on the box, enter the interaction state.
    _this3.searchInput.focus();
  };

  this.onComboBoxFocus = function (e) {
    // If the user has tabbed to the combo box, open it.
    if (e.target === _this3.searchInput) {
      _this3.searchInput.focus();
      return;
    }

    // If a user clicks on an option without selecting it, then it will take focus
    // and we need to update the index.
    var optionIndex = _this3.options.indexOf(e.target);
    if (optionIndex !== -1) {
      _this3.activeOptionIndex = optionIndex;
    }
  };

  this.onSearchChange = function (searchValue) {
    if (_this3.props.onSearchChange) {
      _this3.props.onSearchChange(searchValue);
    }
    _this3.setState({ searchValue: searchValue });
  };

  this.comboBoxRef = function (node) {
    _this3.comboBox = node;
  };

  this.autoSizeInputRef = function (node) {
    _this3.autoSizeInput = node;
  };

  this.searchInputRef = function (node) {
    _this3.searchInput = node;
  };

  this.optionsListRef = function (node) {
    _this3.optionsList = node;
  };

  this.optionRef = function (index, node) {
    // Sometimes the node is null.
    if (node) {
      // Store all options.
      _this3.options[index] = node;
    }
  };
};

EuiComboBox.__docgenInfo = [{
  'description': '',
  'displayName': 'EuiComboBox',
  'methods': [{
    'name': 'getMatchingOptions',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'options',
      'type': null
    }, {
      'name': 'selectedOptions',
      'type': null
    }, {
      'name': 'searchValue',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'openList',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'closeList',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'updateListPosition',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'listBounds',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'tabAway',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'amount',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'incrementActiveOptionIndex',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'amount',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'hasActiveOption',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'clearActiveOption',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'focusActiveOption',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'focusSearchInput',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'clearSearchValue',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'removeLastOption',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'addCustomOption',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'doesSearchMatchOnlyOption',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'areAllOptionsSelected',
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
    'name': 'onDocumentFocusChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'event',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onKeyDown',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'e',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onOptionEnterKey',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'option',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onOptionClick',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'option',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onAddOption',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'addedOption',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onRemoveOption',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'removedOption',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onComboBoxClick',
    'docblock': null,
    'modifiers': [],
    'params': [],
    'returns': null
  }, {
    'name': 'onComboBoxFocus',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'e',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'onSearchChange',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'searchValue',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'comboBoxRef',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'node',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'autoSizeInputRef',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'node',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'searchInputRef',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'node',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'optionsListRef',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'node',
      'type': null
    }],
    'returns': null
  }, {
    'name': 'optionRef',
    'docblock': null,
    'modifiers': [],
    'params': [{
      'name': 'index',
      'type': null
    }, {
      'name': 'node',
      'type': null
    }],
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
    'className': {
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
    'isLoading': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    },
    'async': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    },
    'singleSelection': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    },
    'noSuggestions': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    },
    'options': {
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
    'selectedOptions': {
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
    'onChange': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'onSearchChange': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'onCreateOption': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'renderOption': {
      'type': {
        'name': 'func'
      },
      'required': false,
      'description': ''
    },
    'isInvalid': {
      'type': {
        'name': 'bool'
      },
      'required': false,
      'description': ''
    }
  }
}];