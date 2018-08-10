'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ELASTIC_CLOUD_INSTRUCTIONS = undefined;

var _instruction_variant = require('../../../common/tutorials/instruction_variant');

var _apm_client_instructions = require('./apm_client_instructions');

const SERVER_URL_INSTRUCTION = {
  title: 'APM Server endpoint',
  textPre: `Retrieve the APM Server URL from the Deployments section on the Elastic Cloud dashboard.
    You will also need the APM Server secret token, which was generated on deployment.`
};

const ELASTIC_CLOUD_INSTRUCTIONS = exports.ELASTIC_CLOUD_INSTRUCTIONS = {
  instructionSets: [{
    title: 'APM Agents',
    instructionVariants: [{
      id: _instruction_variant.INSTRUCTION_VARIANT.NODE,
      instructions: [SERVER_URL_INSTRUCTION, ..._apm_client_instructions.NODE_CLIENT_INSTRUCTIONS]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.DJANGO,
      instructions: [SERVER_URL_INSTRUCTION, ..._apm_client_instructions.DJANGO_CLIENT_INSTRUCTIONS]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.FLASK,
      instructions: [SERVER_URL_INSTRUCTION, ..._apm_client_instructions.FLASK_CLIENT_INSTRUCTIONS]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.RAILS,
      instructions: [SERVER_URL_INSTRUCTION, ..._apm_client_instructions.RAILS_CLIENT_INSTRUCTIONS]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.RACK,
      instructions: [SERVER_URL_INSTRUCTION, ..._apm_client_instructions.RACK_CLIENT_INSTRUCTIONS]
    }, {
      id: _instruction_variant.INSTRUCTION_VARIANT.JS,
      instructions: [SERVER_URL_INSTRUCTION, ..._apm_client_instructions.JS_CLIENT_INSTRUCTIONS]
    }]
  }]
};