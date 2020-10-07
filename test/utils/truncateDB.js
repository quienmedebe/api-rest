const {models} = require('../../src/services/database');

async function truncateDB() {
  const destroyModel = async key => {
    if (['sequelize', 'Sequelize'].includes(key)) return null;
    return await models[key.toString()].destroy({where: {}, force: {}});
  };

  // await models.sequelize.query("SET session_replication_role = 'replica';");
  await Promise.all(Object.keys(models).map(destroyModel));
  // await models.sequelize.query("SET session_replication_role = 'origin';");
}

module.exports = truncateDB;
