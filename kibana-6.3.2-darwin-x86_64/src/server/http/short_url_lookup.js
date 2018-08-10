'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shortUrlLookupProvider = shortUrlLookupProvider;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function shortUrlLookupProvider(server) {
  async function updateMetadata(doc, req) {
    try {
      await req.getSavedObjectsClient().update('url', doc.id, {
        accessDate: new Date(),
        accessCount: (0, _lodash.get)(doc, 'attributes.accessCount', 0) + 1
      });
    } catch (err) {
      server.log('Warning: Error updating url metadata', err);
      //swallow errors. It isn't critical if there is no update.
    }
  }

  return {
    async generateUrlId(url, req) {
      const id = _crypto2.default.createHash('md5').update(url).digest('hex');
      const savedObjectsClient = req.getSavedObjectsClient();
      const { isConflictError } = savedObjectsClient.errors;

      try {
        const doc = await savedObjectsClient.create('url', {
          url,
          accessCount: 0,
          createDate: new Date(),
          accessDate: new Date()
        }, { id });

        return doc.id;
      } catch (error) {
        if (isConflictError(error)) {
          return id;
        }

        throw error;
      }
    },

    async getUrl(id, req) {
      const doc = await req.getSavedObjectsClient().get('url', id);
      updateMetadata(doc, req);

      return doc.attributes.url;
    }
  };
}