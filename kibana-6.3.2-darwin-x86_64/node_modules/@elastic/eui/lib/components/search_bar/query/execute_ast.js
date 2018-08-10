'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeAst = exports.createFilter = undefined;

var _operators;

var _lodash = require('lodash');

var _predicate = require('../../../services/predicate');

var _operators2 = require('./operators');

var _ast = require('./ast');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EXPLAIN_FIELD = '__explain';

var operators = (_operators = {}, _defineProperty(_operators, _ast.AST.Operator.EQ, _operators2.eq), _defineProperty(_operators, _ast.AST.Operator.GT, _operators2.gt), _defineProperty(_operators, _ast.AST.Operator.GTE, _operators2.gte), _defineProperty(_operators, _ast.AST.Operator.LT, _operators2.lt), _defineProperty(_operators, _ast.AST.Operator.LTE, _operators2.lte), _operators);

var defaultIsClauseMatcher = function defaultIsClauseMatcher(record, clause, explain) {
  var type = clause.type,
      flag = clause.flag,
      match = clause.match;

  var value = (0, _lodash.get)(record, clause.flag);
  var must = _ast.AST.Match.isMustClause(clause);
  var hit = !!value === must;
  if (explain && hit) {
    explain.push({ hit: hit, type: type, flag: flag, match: match });
  }
  return hit;
};

var fieldClauseMatcher = function fieldClauseMatcher(record, field) {
  var clauses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var explain = arguments[3];

  return clauses.every(function (clause) {
    var type = clause.type,
        value = clause.value,
        match = clause.match;

    var operator = operators[clause.operator];
    if (!operator) {
      // unknown matcher
      return true;
    }
    if (!_ast.AST.Match.isMust(match)) {
      operator = function operator(value, token) {
        return !operators[clause.operator](value, token);
      };
    }
    var recordValue = (0, _lodash.get)(record, field);
    var hit = (0, _predicate.isArray)(value) ? value.some(function (v) {
      return operator(recordValue, v);
    }) : operator(recordValue, value);
    if (explain && hit) {
      explain.push({ hit: hit, type: type, field: field, value: value, match: match, operator: operator });
    }
    return hit;
  });
};

var resolveStringFields = function resolveStringFields(record) {
  return Object.keys(record).reduce(function (fields, key) {
    if ((0, _predicate.isString)(record[key])) {
      fields.push(key);
    }
    return fields;
  }, []);
};

var termClauseMatcher = function termClauseMatcher(record, fields) {
  var clauses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var explain = arguments[3];

  fields = fields || resolveStringFields(record);
  return clauses.every(function (clause) {
    var type = clause.type,
        value = clause.value,
        match = clause.match;

    var operator = operators[_ast.AST.Operator.EQ];
    if (_ast.AST.Match.isMustClause(clause)) {
      return fields.some(function (field) {
        var recordValue = (0, _lodash.get)(record, field);
        var hit = operator(recordValue, value);
        if (explain && hit) {
          explain.push({ hit: hit, type: type, field: field, match: match, value: value });
        }
        return hit;
      });
    } else {
      var notMatcher = function notMatcher(value, token) {
        return !operator(value, token);
      };
      return fields.every(function (field) {
        var recordValue = (0, _lodash.get)(record, field);
        var hit = notMatcher(recordValue, value);
        if (explain && hit) {
          explain.push({ hit: hit, type: type, field: field, value: value, match: match });
        }
        return hit;
      });
    }
  });
};

var createFilter = exports.createFilter = function createFilter(ast, defaultFields) {
  var isClauseMatcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIsClauseMatcher;
  var explain = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  return function (record) {
    var explainLines = explain ? [] : undefined;
    var termClauses = ast.getTermClauses();
    var fields = ast.getFieldNames();
    var isClauses = ast.getIsClauses();
    var match = termClauseMatcher(record, defaultFields, termClauses, explainLines) && fields.every(function (field) {
      return fieldClauseMatcher(record, field, ast.getFieldClauses(field), explainLines);
    }) && isClauses.every(function (clause) {
      return isClauseMatcher(record, clause, explainLines);
    });
    if (explainLines) {
      record[EXPLAIN_FIELD] = explainLines;
    }
    return match;
  };
};

var executeAst = exports.executeAst = function executeAst(ast, items) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var isClauseMatcher = options.isClauseMatcher,
      defaultFields = options.defaultFields,
      explain = options.explain;

  var filter = createFilter(ast, defaultFields, isClauseMatcher, explain);
  return items.filter(filter);
};