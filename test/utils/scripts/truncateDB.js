const models = require('../../../src/database/models');

async function truncate() {
  const truncateModels = Object.keys(models)
    .filter(name => {
      return !['sequelize', 'Sequelize'].includes(name);
    })
    .map(async model => {
      await models[model.toString()].destroy({force: true, where: {}});
    });
  await Promise.all(truncateModels);
}

module.exports = truncate;
