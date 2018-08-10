'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = remove;
exports.removeCli = removeCli;
async function remove(keystore, key) {
  keystore.remove(key);
  keystore.save();
}

function removeCli(program, keystore) {
  program.command('remove <key>').description('Remove a setting from the keystore').option('-s, --silent', 'prevent all logging').action(remove.bind(null, keystore));
}