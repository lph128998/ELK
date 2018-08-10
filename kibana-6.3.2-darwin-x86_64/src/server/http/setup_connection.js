'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.setupConnection = setupConnection;

var _fs = require('fs');

var _secure_options = require('./secure_options');

var _secure_options2 = _interopRequireDefault(_secure_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupConnection(server, config) {
  const host = config.get('server.host');
  const port = config.get('server.port');

  const connectionOptions = {
    host,
    port,
    state: {
      strictHeader: false
    },
    routes: {
      cors: config.get('server.cors'),
      payload: {
        maxBytes: config.get('server.maxPayloadBytes')
      },
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  };

  const useSsl = config.get('server.ssl.enabled');

  // not using https? well that's easy!
  if (!useSsl) {
    const connection = server.connection(connectionOptions);

    // revert to previous 5m keepalive timeout in Node < 8
    connection.listener.keepAliveTimeout = 120e3;

    return;
  }

  const connection = server.connection(_extends({}, connectionOptions, {
    tls: {
      key: (0, _fs.readFileSync)(config.get('server.ssl.key')),
      cert: (0, _fs.readFileSync)(config.get('server.ssl.certificate')),
      ca: config.get('server.ssl.certificateAuthorities').map(ca => (0, _fs.readFileSync)(ca, 'utf8')),
      passphrase: config.get('server.ssl.keyPassphrase'),

      ciphers: config.get('server.ssl.cipherSuites').join(':'),
      // We use the server's cipher order rather than the client's to prevent the BEAST attack
      honorCipherOrder: true,
      secureOptions: (0, _secure_options2.default)(config.get('server.ssl.supportedProtocols'))
    }
  }));

  // revert to previous 5m keepalive timeout in Node < 8
  connection.listener.keepAliveTimeout = 120e3;

  const badRequestResponse = new Buffer('HTTP/1.1 400 Bad Request\r\n\r\n', 'ascii');
  connection.listener.on('clientError', (err, socket) => {
    if (socket.writable) {
      socket.end(badRequestResponse);
    } else {
      socket.destroy(err);
    }
  });
}