'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUpdateRoute = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createUpdateRoute = exports.createUpdateRoute = prereqs => {
  return {
    path: '/api/saved_objects/{type}/{id}',
    method: 'PUT',
    config: {
      pre: [prereqs.getSavedObjectsClient],
      validate: {
        params: _joi2.default.object().keys({
          type: _joi2.default.string().required(),
          id: _joi2.default.string().required()
        }).required(),
        payload: _joi2.default.object({
          attributes: _joi2.default.object().required(),
          version: _joi2.default.number().min(1)
        }).required()
      },
      handler(request, reply) {
        const { savedObjectsClient } = request.pre;
        const { type, id } = request.params;
        const { attributes, version } = request.payload;
        const options = { version };

        reply(savedObjectsClient.update(type, id, attributes, options));
      }
    }
  };
};