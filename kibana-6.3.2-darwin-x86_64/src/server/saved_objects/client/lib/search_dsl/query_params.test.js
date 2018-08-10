'use strict';

var _query_params = require('./query_params');

const MAPPINGS = {
  rootType: {
    properties: {
      type: {
        type: 'keyword'
      },
      pending: {
        properties: {
          title: {
            type: 'text'
          }
        }
      },
      saved: {
        properties: {
          title: {
            type: 'text',
            fields: {
              raw: {
                type: 'keyword'
              }
            }
          },
          obj: {
            properties: {
              key1: {
                type: 'text'
              }
            }
          }
        }
      }
    }
  }
};

describe('searchDsl/queryParams', () => {
  describe('{}', () => {
    it('searches for everything', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS)).toEqual({});
    });
  });

  describe('{type}', () => {
    it('includes just a terms filter', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, 'saved')).toEqual({
        query: {
          bool: {
            filter: [{
              term: { type: 'saved' }
            }]
          }
        }
      });
    });
  });

  describe('{search}', () => {
    it('includes just a sqs query', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, null, 'us*')).toEqual({
        query: {
          bool: {
            must: [{
              simple_query_string: {
                query: 'us*',
                all_fields: true
              }
            }]
          }
        }
      });
    });
  });

  describe('{type,search}', () => {
    it('includes bool with sqs query and term filter for type', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, 'saved', 'y*')).toEqual({
        query: {
          bool: {
            filter: [{ term: { type: 'saved' } }],
            must: [{
              simple_query_string: {
                query: 'y*',
                all_fields: true
              }
            }]
          }
        }
      });
    });
  });

  describe('{search,searchFields}', () => {
    it('includes all types for field', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, null, 'y*', ['title'])).toEqual({
        query: {
          bool: {
            must: [{
              simple_query_string: {
                query: 'y*',
                fields: ['type.title', 'pending.title', 'saved.title']
              }
            }]
          }
        }
      });
    });
    it('supports field boosting', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, null, 'y*', ['title^3'])).toEqual({
        query: {
          bool: {
            must: [{
              simple_query_string: {
                query: 'y*',
                fields: ['type.title^3', 'pending.title^3', 'saved.title^3']
              }
            }]
          }
        }
      });
    });
    it('supports field and multi-field', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, null, 'y*', ['title', 'title.raw'])).toEqual({
        query: {
          bool: {
            must: [{
              simple_query_string: {
                query: 'y*',
                fields: ['type.title', 'pending.title', 'saved.title', 'type.title.raw', 'pending.title.raw', 'saved.title.raw']
              }
            }]
          }
        }
      });
    });
  });

  describe('{type,search,searchFields}', () => {
    it('includes bool, and sqs with field list', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, 'saved', 'y*', ['title'])).toEqual({
        query: {
          bool: {
            filter: [{ term: { type: 'saved' } }],
            must: [{
              simple_query_string: {
                query: 'y*',
                fields: ['saved.title']
              }
            }]
          }
        }
      });
    });
    it('supports fields pointing to multi-fields', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, 'saved', 'y*', ['title.raw'])).toEqual({
        query: {
          bool: {
            filter: [{ term: { type: 'saved' } }],
            must: [{
              simple_query_string: {
                query: 'y*',
                fields: ['saved.title.raw']
              }
            }]
          }
        }
      });
    });
    it('supports multiple search fields', () => {
      expect((0, _query_params.getQueryParams)(MAPPINGS, 'saved', 'y*', ['title', 'title.raw'])).toEqual({
        query: {
          bool: {
            filter: [{ term: { type: 'saved' } }],
            must: [{
              simple_query_string: {
                query: 'y*',
                fields: ['saved.title', 'saved.title.raw']
              }
            }]
          }
        }
      });
    });
  });
});