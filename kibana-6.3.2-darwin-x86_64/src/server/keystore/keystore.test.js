'use strict';

var _mockFs = require('mock-fs');

var _mockFs2 = _interopRequireDefault(_mockFs);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require('fs');

var _keystore = require('./keystore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Keystore', () => {
  const sandbox = _sinon2.default.sandbox.create();

  const protoctedKeystoreData = '1:4BnWfydL8NwFIQJg+VQKe0jlIs7uXtty6+++yaWPbSB' + 'KIX3d9nPfQ20K1C6Xh26E/gMJAQ9jh7BxK0+W3lt/iDJBJn44wqX3pQ0189iGkNBL0ibDCc' + 'tz4mRy6+hqwiLxiukpH8ELAJsff8LNNHr+gNzX/2k/GvB7nQ==';

  const unprotectedKeystoreData = '1:IxR0geiUTMJp8ueHDkqeUJ0I9eEw4NJPXIJi22UDy' + 'fGfJSy4mHBBuGPkkAix/x/YFfIxo4tiKGdJ2oVTtU8LgKDkVoGdL+z7ylY4n3myatt6osqh' + 'I4lzJ9MRy21UcAJki2qFUTj4TYuvhta3LId+RM5UX/dJ2468hQ==';

  beforeEach(() => {
    (0, _mockFs2.default)({
      '/data': {
        'protected.keystore': protoctedKeystoreData,
        'unprotected.keystore': unprotectedKeystoreData
      },
      '/inaccessible': _mockFs2.default.directory({
        mode: '0000'
      })
    });
  });

  afterEach(() => {
    _mockFs2.default.restore();
    sandbox.restore();
  });

  describe('save', () => {
    it('thows permission denied', () => {
      expect.assertions(1);
      const path = '/inaccessible/test.keystore';

      try {
        const keystore = new _keystore.Keystore(path);
        keystore.save();
      } catch (e) {
        expect(e.code).toEqual('EACCES');
      }
    });

    it('creates keystore with version', () => {
      const path = '/data/test.keystore';

      const keystore = new _keystore.Keystore(path);
      keystore.save();

      const fileBuffer = (0, _fs.readFileSync)(path);
      const contents = fileBuffer.toString();
      const [version, data] = contents.split(':');

      expect(version).toEqual('1');
      expect(data.length).toBeGreaterThan(100);
    });
  });

  describe('load', () => {
    it('is called on initialization', () => {
      const load = sandbox.spy(_keystore.Keystore.prototype, 'load');

      new _keystore.Keystore('/data/protected.keystore', 'changeme');

      expect(load.calledOnce).toBe(true);
    });

    it('can load a password protected keystore', () => {
      const keystore = new _keystore.Keystore('/data/protected.keystore', 'changeme');
      expect(keystore.data).toEqual({ 'a1.b2.c3': 'foo', 'a2': 'bar' });
    });

    it('throws unable to read keystore', () => {
      expect.assertions(1);
      try {
        new _keystore.Keystore('/data/protected.keystore', 'wrongpassword');
      } catch (e) {
        expect(e).toBeInstanceOf(_keystore.Keystore.errors.UnableToReadKeystore);
      }
    });

    it('gracefully handles keystore not found', () => {
      new _keystore.Keystore('/data/nonexistent.keystore');
    });
  });

  describe('reset', () => {
    it('clears the data', () => {
      const keystore = new _keystore.Keystore('/data/protected.keystore', 'changeme');
      keystore.reset();
      expect(keystore.data).toEqual({});
    });
  });

  describe('keys', () => {
    it('lists object keys', () => {
      const keystore = new _keystore.Keystore('/data/unprotected.keystore');
      const keys = keystore.keys();

      expect(keys).toEqual(['a1.b2.c3', 'a2']);
    });
  });

  describe('has', () => {
    it('returns true if key exists', () => {
      const keystore = new _keystore.Keystore('/data/unprotected.keystore');

      expect(keystore.has('a2')).toBe(true);
    });

    it('returns false if key does not exist', () => {
      const keystore = new _keystore.Keystore('/data/unprotected.keystore');

      expect(keystore.has('invalid')).toBe(false);
    });
  });

  describe('add', () => {
    it('adds a key/value pair', () => {
      const keystore = new _keystore.Keystore('/data/unprotected.keystore');
      keystore.add('a3', 'baz');

      expect(keystore.data).toEqual({
        'a1.b2.c3': 'foo',
        'a2': 'bar',
        'a3': 'baz'
      });
    });
  });

  describe('remove', () => {
    it('removes a key/value pair', () => {
      const keystore = new _keystore.Keystore('/data/unprotected.keystore');
      keystore.remove('a1.b2.c3');

      expect(keystore.data).toEqual({
        'a2': 'bar'
      });
    });
  });

  describe('encrypt', () => {
    it('has randomness ', () => {
      const text = 'foo';
      const password = 'changeme';

      const dataOne = _keystore.Keystore.encrypt(text, password);
      const dataTwo = _keystore.Keystore.encrypt(text, password);

      expect(dataOne).not.toEqual(dataTwo);
    });

    it('can immediately be decrypted', () => {
      const password = 'changeme';
      const secretText = 'foo';

      const data = _keystore.Keystore.encrypt(secretText, password);
      const text = _keystore.Keystore.decrypt(data, password);

      expect(text).toEqual(secretText);
    });
  });

  describe('decrypt', () => {
    const text = 'foo';
    const password = 'changeme';
    const ciphertext = 'ctvRsD0l0u958QoPuINQX+wgspbXt2+7IJ7gNbCND2dCGZxYOCwMH9' + 'MEdZZG4cevSrnhYOaxh24POFhtisSdCSlLWsKNQU8NK1zqNQ3RRP8HxayZJB7ly9uOLbDS+' + 'Ew=';

    it('can decrypt data', () => {
      const data = _keystore.Keystore.decrypt(ciphertext, password);
      expect(data).toEqual(text);
    });

    it('throws error for invalid password', () => {
      expect.assertions(1);
      try {
        _keystore.Keystore.decrypt(ciphertext, 'invalid');
      } catch (e) {
        expect(e).toBeInstanceOf(_keystore.Keystore.errors.UnableToReadKeystore);
      }
    });

    it('throws error for corrupt ciphertext', () => {
      expect.assertions(1);
      try {
        _keystore.Keystore.decrypt('thisisinvalid', password);
      } catch (e) {
        expect(e).toBeInstanceOf(_keystore.Keystore.errors.UnableToReadKeystore);
      }
    });
  });
});