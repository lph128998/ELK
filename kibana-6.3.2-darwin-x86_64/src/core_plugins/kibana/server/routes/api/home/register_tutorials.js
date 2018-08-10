'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTutorials = registerTutorials;
function registerTutorials(server) {
  server.route({
    path: '/api/kibana/home/tutorials',
    method: ['GET'],
    handler: async function (req, reply) {
      reply(server.getTutorials());
    }
  });
}