const redis = require('redis');
const {promisify} = require('util');

function createClient(options = {}) {
  const client = redis.createClient({
    ...options,
  });

  client.authAsync = promisify(client.auth).bind(client);
  client.getAsync = promisify(client.get).bind(client);
  client.setAsync = promisify(client.set).bind(client);
  client.hgetallAsync = promisify(client.hgetall).bind(client);
  client.hmsetAsync = promisify(client.hmset).bind(client);
  client.execAsync = promisify(client.exec).bind(client);
  client.quitAsync = promisify(client.quit).bind(client);
  client.duplicateAsync = promisify(client.duplicate).bind(client);
  client.sendCommandAsync = promisify(client.send_command).bind(client);
  return client;
}

module.exports = createClient;
