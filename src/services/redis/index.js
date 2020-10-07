const createClient = require('./createClient');

let client;

function connect(options = {}) {
  client = createClient(options);
}

function getClient() {
  if (!client) {
    throw new Error('Client not initialized');
  }

  return client;
}

exports.connect = connect;
exports.createClient = createClient;
exports.getClient = getClient;

module.exports = exports;
