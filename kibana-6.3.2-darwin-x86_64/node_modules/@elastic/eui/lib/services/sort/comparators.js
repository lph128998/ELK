'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comparators = undefined;

var _sort_direction = require('./sort_direction');

var _objects = require('../objects');

var Comparators = exports.Comparators = Object.freeze({

  default: function _default() {
    var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _sort_direction.SortDirection.ASC;

    return function (v1, v2) {
      if (v1 === v2) {
        return 0;
      }
      var result = v1 > v2 ? 1 : -1;
      return _sort_direction.SortDirection.isAsc(direction) ? result : -1 * result;
    };
  },

  reverse: function reverse(comparator) {
    return function (v1, v2) {
      return comparator(v2, v1);
    };
  },

  value: function value(valueCallback) {
    var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    if (!comparator) {
      comparator = this.default(_sort_direction.SortDirection.ASC);
    }
    return function (o1, o2) {
      return comparator(valueCallback(o1), valueCallback(o2));
    };
  },
  property: function property(prop) {
    var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    return this.value(function (value) {
      return (0, _objects.get)(value, prop);
    }, comparator);
  }
});