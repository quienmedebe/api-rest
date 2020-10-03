const {models} = require('../../src/modules/database');

async function truncate() {
  const destroyModel = key => {
    if (['sequelize', 'Sequelize'].includes(key)) return null;
    return models[key.toString()].destroy({truncate: {cascade: true}});
  };

  await models.sequelize.query("SET session_replication_role = 'replica';");
  await Promise.all(Object.keys(models).map(destroyModel));
  await models.sequelize.query("SET session_replication_role = 'origin';");
}

module.exports = truncate;
