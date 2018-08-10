'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.createCli = createCli;

var _logger = require('../cli_plugin/lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _utils = require('../server/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function create(keystore, command, options) {
  const logger = new _logger2.default(options);

  if (keystore.exists()) {
    const overwrite = await (0, _utils.confirm)('A Kibana keystore already exists. Overwrite?');

    if (!overwrite) {
      return logger.log('Exiting without modifying keystore.');
    }
  }

  keystore.reset();
  keystore.save();

  logger.log(`Created Kibana keystore in ${keystore.path}`);
}

function createCli(program, keystore) {
  program.command('create').description('Creates a new Kibana keystore').option('-s, --silent', 'prevent all logging').action(create.bind(null, keystore));
}