const chai = require('chai');
const chaiHttp = require('chai-http');
const truncateDB = require('./scripts/truncateDB');

chai.use(chaiHttp);
let server, requester;

const prepare = async () => {
  server = require('../../src/app');
  requester = chai.request.agent(server);
  await truncateDB();
};

const tearDown = () => {
  delete require.cache[require.resolve('../../src/app')];
  requester.close();
};

const getRequester = () => {
  return requester;
};

exports.server = server;
exports.getRequester = getRequester;
exports.prepare = prepare;
exports.tearDown = tearDown;
module.exports = exports;
