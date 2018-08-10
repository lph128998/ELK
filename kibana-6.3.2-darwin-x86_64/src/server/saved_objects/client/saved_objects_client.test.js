'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _bluebird = require('bluebird');

var _saved_objects_client = require('./saved_objects_client');

var _search_dsl = require('./lib/search_dsl/search_dsl');

var getSearchDslNS = _interopRequireWildcard(_search_dsl);

var _lib = require('./lib');

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('SavedObjectsClient', () => {
  const sandbox = _sinon2.default.sandbox.create();

  let callAdminCluster;
  let onBeforeWrite;
  let savedObjectsClient;
  const mockTimestamp = '2017-08-14T15:49:14.886Z';
  const mockTimestampFields = { updated_at: mockTimestamp };
  const searchResults = {
    hits: {
      total: 3,
      hits: [{
        _index: '.kibana',
        _type: 'doc',
        _id: 'index-pattern:logstash-*',
        _score: 1,
        _source: _extends({
          type: 'index-pattern'
        }, mockTimestampFields, {
          'index-pattern': {
            title: 'logstash-*',
            timeFieldName: '@timestamp',
            notExpandable: true
          }
        })
      }, {
        _index: '.kibana',
        _type: 'doc',
        _id: 'config:6.0.0-alpha1',
        _score: 1,
        _source: _extends({
          type: 'config'
        }, mockTimestampFields, {
          config: {
            buildNum: 8467,
            defaultIndex: 'logstash-*'
          }
        })
      }, {
        _index: '.kibana',
        _type: 'doc',
        _id: 'index-pattern:stocks-*',
        _score: 1,
        _source: _extends({
          type: 'index-pattern'
        }, mockTimestampFields, {
          'index-pattern': {
            title: 'stocks-*',
            timeFieldName: '@timestamp',
            notExpandable: true
          }
        })
      }]
    }
  };

  const mappings = {
    doc: {
      properties: {
        'index-pattern': {
          properties: {
            someField: {
              type: 'keyword'
            }
          }
        }
      }
    }
  };

  beforeEach(() => {
    callAdminCluster = sandbox.stub();
    onBeforeWrite = sandbox.stub();

    savedObjectsClient = new _saved_objects_client.SavedObjectsClient({
      index: '.kibana-test',
      mappings,
      callCluster: callAdminCluster,
      onBeforeWrite
    });

    sandbox.stub(savedObjectsClient, '_getCurrentTime').returns(mockTimestamp);
    sandbox.stub(getSearchDslNS, 'getSearchDsl').returns({});
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#create', () => {
    beforeEach(() => {
      callAdminCluster.returns(Promise.resolve({
        _type: 'doc',
        _id: 'index-pattern:logstash-*',
        _version: 2
      }));
    });

    it('formats Elasticsearch response', async () => {
      const response = await savedObjectsClient.create('index-pattern', {
        title: 'Logstash'
      });

      expect(response).toEqual(_extends({
        type: 'index-pattern',
        id: 'logstash-*'
      }, mockTimestampFields, {
        version: 2,
        attributes: {
          title: 'Logstash'
        }
      }));
    });

    it('should use ES index action', async () => {
      await savedObjectsClient.create('index-pattern', {
        id: 'logstash-*',
        title: 'Logstash'
      });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWith(callAdminCluster, 'index');
      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });

    it('should use create action if ID defined and overwrite=false', async () => {
      await savedObjectsClient.create('index-pattern', {
        title: 'Logstash'
      }, {
        id: 'logstash-*'
      });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWith(callAdminCluster, 'create');
      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });

    it('allows for id to be provided', async () => {
      await savedObjectsClient.create('index-pattern', {
        title: 'Logstash'
      }, { id: 'logstash-*' });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, _sinon2.default.match.string, _sinon2.default.match({
        id: 'index-pattern:logstash-*'
      }));

      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });

    it('self-generates an ID', async () => {
      await savedObjectsClient.create('index-pattern', {
        title: 'Logstash'
      });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, _sinon2.default.match.string, _sinon2.default.match({
        id: _sinon2.default.match(/index-pattern:[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/)
      }));

      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });
  });

  describe('#bulkCreate', () => {
    it('formats Elasticsearch request', async () => {
      callAdminCluster.returns({ items: [] });

      await savedObjectsClient.bulkCreate([{ type: 'config', id: 'one', attributes: { title: 'Test One' } }, { type: 'index-pattern', id: 'two', attributes: { title: 'Test Two' } }]);

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, 'bulk', _sinon2.default.match({
        body: [{ create: { _type: 'doc', _id: 'config:one' } }, _extends({ type: 'config' }, mockTimestampFields, { config: { title: 'Test One' } }), { create: { _type: 'doc', _id: 'index-pattern:two' } }, _extends({ type: 'index-pattern' }, mockTimestampFields, { 'index-pattern': { title: 'Test Two' } })]
      }));

      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });

    it('should overwrite objects if overwrite is truthy', async () => {
      callAdminCluster.returns({ items: [] });

      await savedObjectsClient.bulkCreate([{ type: 'foo', id: 'bar', attributes: {} }], { overwrite: false });
      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, 'bulk', _sinon2.default.match({
        body: [
        // uses create because overwriting is not allowed
        { create: { _type: 'doc', _id: 'foo:bar' } }, _extends({ type: 'foo' }, mockTimestampFields, { 'foo': {} })]
      }));

      _sinon2.default.assert.calledOnce(onBeforeWrite);

      callAdminCluster.reset();
      onBeforeWrite.reset();

      await savedObjectsClient.bulkCreate([{ type: 'foo', id: 'bar', attributes: {} }], { overwrite: true });
      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, 'bulk', _sinon2.default.match({
        body: [
        // uses index because overwriting is allowed
        { index: { _type: 'doc', _id: 'foo:bar' } }, _extends({ type: 'foo' }, mockTimestampFields, { 'foo': {} })]
      }));

      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });

    it('returns document errors', async () => {
      callAdminCluster.returns(Promise.resolve({
        errors: false,
        items: [{
          create: {
            _type: 'doc',
            _id: 'config:one',
            error: {
              reason: 'type[config] missing'
            }
          }
        }, {
          create: {
            _type: 'doc',
            _id: 'index-pattern:two',
            _version: 2
          }
        }]
      }));

      const response = await savedObjectsClient.bulkCreate([{ type: 'config', id: 'one', attributes: { title: 'Test One' } }, { type: 'index-pattern', id: 'two', attributes: { title: 'Test Two' } }]);

      expect(response).toEqual([{
        id: 'one',
        type: 'config',
        error: { message: 'type[config] missing' }
      }, _extends({
        id: 'two',
        type: 'index-pattern',
        version: 2
      }, mockTimestampFields, {
        attributes: { title: 'Test Two' }
      })]);
    });

    it('formats Elasticsearch response', async () => {
      callAdminCluster.returns(Promise.resolve({
        errors: false,
        items: [{
          create: {
            _type: 'doc',
            _id: 'config:one',
            _version: 2
          }
        }, {
          create: {
            _type: 'doc',
            _id: 'index-pattern:two',
            _version: 2
          }
        }]
      }));

      const response = await savedObjectsClient.bulkCreate([{ type: 'config', id: 'one', attributes: { title: 'Test One' } }, { type: 'index-pattern', id: 'two', attributes: { title: 'Test Two' } }]);

      expect(response).toEqual([_extends({
        id: 'one',
        type: 'config',
        version: 2
      }, mockTimestampFields, {
        attributes: { title: 'Test One' }
      }), _extends({
        id: 'two',
        type: 'index-pattern',
        version: 2
      }, mockTimestampFields, {
        attributes: { title: 'Test Two' }
      })]);
    });
  });

  describe('#delete', () => {
    it('throws notFound when ES is unable to find the document', async () => {
      expect.assertions(1);

      callAdminCluster.returns(Promise.resolve({
        result: 'not_found'
      }));

      try {
        await savedObjectsClient.delete('index-pattern', 'logstash-*');
      } catch (e) {
        expect(e.output.statusCode).toEqual(404);
      }
    });

    it('passes the parameters to callAdminCluster', async () => {
      callAdminCluster.returns({
        result: 'deleted'
      });
      await savedObjectsClient.delete('index-pattern', 'logstash-*');

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, 'delete', {
        type: 'doc',
        id: 'index-pattern:logstash-*',
        refresh: 'wait_for',
        index: '.kibana-test',
        ignore: [404]
      });

      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });
  });

  describe('#find', () => {
    beforeEach(() => {
      callAdminCluster.returns(searchResults);
    });

    it('requires searchFields be an array if defined', async () => {
      try {
        await savedObjectsClient.find({ searchFields: 'string' });
        throw new Error('expected find() to reject');
      } catch (error) {
        _sinon2.default.assert.notCalled(callAdminCluster);
        _sinon2.default.assert.notCalled(onBeforeWrite);
        expect(error.message).toMatch('must be an array');
      }
    });

    it('requires fields be an array if defined', async () => {
      try {
        await savedObjectsClient.find({ fields: 'string' });
        throw new Error('expected find() to reject');
      } catch (error) {
        _sinon2.default.assert.notCalled(callAdminCluster);
        _sinon2.default.assert.notCalled(onBeforeWrite);
        expect(error.message).toMatch('must be an array');
      }
    });

    it('passes mappings, search, searchFields, type, sortField, and sortOrder to getSearchDsl', async () => {
      const relevantOpts = {
        search: 'foo*',
        searchFields: ['foo'],
        type: 'bar',
        sortField: 'name',
        sortOrder: 'desc'
      };

      await savedObjectsClient.find(relevantOpts);
      _sinon2.default.assert.calledOnce(_lib.getSearchDsl);
      _sinon2.default.assert.calledWithExactly(_lib.getSearchDsl, mappings, relevantOpts);
    });

    it('merges output of getSearchDsl into es request body', async () => {
      _lib.getSearchDsl.returns({ query: 1, aggregations: 2 });
      await savedObjectsClient.find();
      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.notCalled(onBeforeWrite);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, 'search', _sinon2.default.match({
        body: _sinon2.default.match({
          query: 1,
          aggregations: 2
        })
      }));
    });

    it('formats Elasticsearch response', async () => {
      const count = searchResults.hits.hits.length;

      const response = await savedObjectsClient.find();

      expect(response.total).toBe(count);
      expect(response.saved_objects).toHaveLength(count);

      searchResults.hits.hits.forEach((doc, i) => {
        expect(response.saved_objects[i]).toEqual(_extends({
          id: doc._id.replace(/(index-pattern|config)\:/, ''),
          type: doc._source.type
        }, mockTimestampFields, {
          version: doc._version,
          attributes: doc._source[doc._source.type]
        }));
      });
    });

    it('accepts per_page/page', async () => {
      await savedObjectsClient.find({ perPage: 10, page: 6 });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, _sinon2.default.match.string, _sinon2.default.match({
        size: 10,
        from: 50
      }));

      _sinon2.default.assert.notCalled(onBeforeWrite);
    });

    it('can filter by fields', async () => {
      await savedObjectsClient.find({ fields: ['title'] });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, _sinon2.default.match.string, _sinon2.default.match({
        _source: ['*.title', 'type', 'title']
      }));

      _sinon2.default.assert.notCalled(onBeforeWrite);
    });
  });

  describe('#get', () => {
    beforeEach(() => {
      callAdminCluster.returns(Promise.resolve({
        _id: 'index-pattern:logstash-*',
        _type: 'doc',
        _version: 2,
        _source: _extends({
          type: 'index-pattern'
        }, mockTimestampFields, {
          'index-pattern': {
            title: 'Testing'
          }
        })
      }));
    });

    it('formats Elasticsearch response', async () => {
      const response = await savedObjectsClient.get('index-pattern', 'logstash-*');
      _sinon2.default.assert.notCalled(onBeforeWrite);
      expect(response).toEqual({
        id: 'logstash-*',
        type: 'index-pattern',
        updated_at: mockTimestamp,
        version: 2,
        attributes: {
          title: 'Testing'
        }
      });
    });

    it('prepends type to the id', async () => {
      await savedObjectsClient.get('index-pattern', 'logstash-*');

      _sinon2.default.assert.notCalled(onBeforeWrite);
      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, _sinon2.default.match.string, _sinon2.default.match({
        id: 'index-pattern:logstash-*',
        type: 'doc'
      }));
    });
  });

  describe('#bulkGet', () => {
    it('accepts a array of mixed type and ids', async () => {
      callAdminCluster.returns({ docs: [] });

      await savedObjectsClient.bulkGet([{ id: 'one', type: 'config' }, { id: 'two', type: 'index-pattern' }]);

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, _sinon2.default.match.string, _sinon2.default.match({
        body: {
          docs: [{ _type: 'doc', _id: 'config:one' }, { _type: 'doc', _id: 'index-pattern:two' }]
        }
      }));

      _sinon2.default.assert.notCalled(onBeforeWrite);
    });

    it('returns early for empty objects argument', async () => {
      callAdminCluster.returns({ docs: [] });

      const response = await savedObjectsClient.bulkGet([]);

      expect(response.saved_objects).toHaveLength(0);
      _sinon2.default.assert.notCalled(callAdminCluster);
      _sinon2.default.assert.notCalled(onBeforeWrite);
    });

    it('reports error on missed objects', async () => {
      callAdminCluster.returns(Promise.resolve({
        docs: [{
          _type: 'doc',
          _id: 'config:good',
          found: true,
          _version: 2,
          _source: _extends({}, mockTimestampFields, { config: { title: 'Test' } })
        }, {
          _type: 'doc',
          _id: 'config:bad',
          found: false
        }]
      }));

      const { saved_objects: savedObjects } = await savedObjectsClient.bulkGet([{ id: 'good', type: 'config' }, { id: 'bad', type: 'config' }]);

      _sinon2.default.assert.notCalled(onBeforeWrite);
      _sinon2.default.assert.calledOnce(callAdminCluster);

      expect(savedObjects).toHaveLength(2);
      expect(savedObjects[0]).toEqual(_extends({
        id: 'good',
        type: 'config'
      }, mockTimestampFields, {
        version: 2,
        attributes: { title: 'Test' }
      }));
      expect(savedObjects[1]).toEqual({
        id: 'bad',
        type: 'config',
        error: { statusCode: 404, message: 'Not found' }
      });
    });
  });

  describe('#update', () => {
    const id = 'logstash-*';
    const type = 'index-pattern';
    const newVersion = 2;
    const attributes = { title: 'Testing' };

    beforeEach(() => {
      callAdminCluster.returns(Promise.resolve({
        _id: `${type}:${id}`,
        _type: 'doc',
        _version: newVersion,
        result: 'updated'
      }));
    });

    it('returns current ES document version', async () => {
      const response = await savedObjectsClient.update('index-pattern', 'logstash-*', attributes);
      expect(response).toEqual(_extends({
        id,
        type
      }, mockTimestampFields, {
        version: newVersion,
        attributes
      }));
    });

    it('accepts version', async () => {
      await savedObjectsClient.update(type, id, { title: 'Testing' }, { version: newVersion - 1 });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, _sinon2.default.match.string, _sinon2.default.match({
        version: newVersion - 1
      }));
    });

    it('passes the parameters to callAdminCluster', async () => {
      await savedObjectsClient.update('index-pattern', 'logstash-*', { title: 'Testing' });

      _sinon2.default.assert.calledOnce(callAdminCluster);
      _sinon2.default.assert.calledWithExactly(callAdminCluster, 'update', {
        type: 'doc',
        id: 'index-pattern:logstash-*',
        version: undefined,
        body: {
          doc: { updated_at: mockTimestamp, 'index-pattern': { title: 'Testing' } }
        },
        ignore: [404],
        refresh: 'wait_for',
        index: '.kibana-test'
      });

      _sinon2.default.assert.calledOnce(onBeforeWrite);
    });
  });

  describe('onBeforeWrite', () => {
    it('blocks calls to callCluster of requests', async () => {
      onBeforeWrite.returns((0, _bluebird.delay)(500));
      callAdminCluster.returns({ result: 'deleted', found: true });

      const deletePromise = savedObjectsClient.delete('type', 'id');
      await (0, _bluebird.delay)(100);
      _sinon2.default.assert.calledOnce(onBeforeWrite);
      _sinon2.default.assert.notCalled(callAdminCluster);
      await deletePromise;
      _sinon2.default.assert.calledOnce(onBeforeWrite);
      _sinon2.default.assert.calledOnce(callAdminCluster);
    });

    it('can throw es errors and have them decorated as SavedObjectsClient errors', async () => {
      expect.assertions(3);

      const es401 = new _elasticsearch2.default.errors[401]();
      expect(_saved_objects_client.SavedObjectsClient.errors.isNotAuthorizedError(es401)).toBe(false);
      onBeforeWrite.throws(es401);

      try {
        await savedObjectsClient.delete('type', 'id');
      } catch (error) {
        _sinon2.default.assert.calledOnce(onBeforeWrite);
        expect(error).toBe(es401);
        expect(_saved_objects_client.SavedObjectsClient.errors.isNotAuthorizedError(error)).toBe(true);
      }
    });
  });
});