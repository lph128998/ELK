'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keystore = undefined;

var _fs = require('fs');

var _crypto = require('crypto');

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const VERSION = 1;
const ALGORITHM = 'aes-256-gcm';
const ITERATIONS = 10000;

class Keystore {
  constructor(path, password = '') {
    this.path = path;
    this.password = password;

    this.reset();
    this.load();
  }

  static encrypt(text, password = '') {
    const iv = (0, _crypto.randomBytes)(12);
    const salt = (0, _crypto.randomBytes)(64);
    const key = (0, _crypto.pbkdf2Sync)(password, salt, ITERATIONS, 32, 'sha512');

    const cipher = (0, _crypto.createCipheriv)(ALGORITHM, key, iv);

    const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, ciphertext]).toString('base64');
  }

  static decrypt(data, password = '') {
    try {
      const bData = new Buffer(data, 'base64');

      // convert data to buffers
      const salt = bData.slice(0, 64);
      const iv = bData.slice(64, 76);
      const tag = bData.slice(76, 92);
      const text = bData.slice(92);

      const key = (0, _crypto.pbkdf2Sync)(password, salt, ITERATIONS, 32, 'sha512');

      const decipher = (0, _crypto.createDecipheriv)(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
    } catch (e) {
      throw new errors.UnableToReadKeystore();
    }
  }

  save() {
    const text = JSON.stringify(this.data);

    // The encrypted text and the version are colon delimited to make
    // it easy to visually read the version as we could have easily
    // included it with the buffer

    const keystore = [VERSION, Keystore.encrypt(text, this.password)].join(':');

    (0, _fs.writeFileSync)(this.path, keystore);
  }

  load() {
    try {
      const keystore = (0, _fs.readFileSync)(this.path);
      const [, data] = keystore.toString().split(':');

      this.data = JSON.parse(Keystore.decrypt(data, this.password));
    } catch (e) {
      if (e.code === 'ENOENT') {
        return;
      }

      throw e;
    }
  }

  reset() {
    this.data = {};
  }

  exists() {
    return (0, _fs.existsSync)(this.path);
  }

  keys() {
    return Object.keys(this.data);
  }

  has(key) {
    return this.keys().indexOf(key) > -1;
  }

  add(key, value) {
    this.data[key] = value;
  }

  remove(key) {
    delete this.data[key];
  }
}
exports.Keystore = Keystore;
Keystore.errors = errors;