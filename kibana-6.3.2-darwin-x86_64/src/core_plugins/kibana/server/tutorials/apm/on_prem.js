'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ON_PREM_INSTRUCTIONS = undefined;

var _instruction_variant = require('../../../common/tutorials/instruction_variant');

var _apm_server_instructions = require('./apm_server_instructions');

var _apm_client_instructions = require('./apm_client_instructions');

const ON_PREM_INSTRUCTIONS = exports.ON_PREM_INSTRUCTIONS = {
  instructionSets: [{
    title: 'APM Server',
    instructionVariants: [{
      id: _instruction_variant.INSTRUCTION_VARIANT.OSX,
      instructions: [_apm_server_instructions.DOWNLOAD_SERVER_OSX, _apm_server_instructions.IMPORT_DASHBOARD_UNIX, _apm_server_instructions.EDIT_CONFIG, _apm_server_instructions.START_SERVER_UNIX]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.DEB,
      instructions: [_apm_server_instructions.DOWNLOAD_SERVER_DEB, _apm_server_instructions.IMPORT_DASHBOARD_UNIX, _apm_server_instructions.EDIT_CONFIG, _apm_server_instructions.START_SERVER_UNIX]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.RPM,
      instructions: [_apm_server_instructions.DOWNLOAD_SERVER_RPM, _apm_server_instructions.IMPORT_DASHBOARD_UNIX, _apm_server_instructions.EDIT_CONFIG, _apm_server_instructions.START_SERVER_UNIX]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.WINDOWS,
      instructions: _apm_server_instructions.WINDOWS_SERVER_INSTRUCTIONS
    }]
  }, {
    title: 'APM Agents',
    instructionVariants: [{
      id: _instruction_variant.INSTRUCTION_VARIANT.NODE,
      instructions: _apm_client_instructions.NODE_CLIENT_INSTRUCTIONS
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.DJANGO,
      instructions: _apm_client_instructions.DJANGO_CLIENT_INSTRUCTIONS
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.FLASK,
      instructions: _apm_client_instructions.FLASK_CLIENT_INSTRUCTIONS
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.RAILS,
      instructions: _apm_client_instructions.RAILS_CLIENT_INSTRUCTIONS
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.RACK,
      instructions: _apm_client_instructions.RACK_CLIENT_INSTRUCTIONS
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.JS,
      instructions: _apm_client_instructions.JS_CLIENT_INSTRUCTIONS
    }]
  }]
};