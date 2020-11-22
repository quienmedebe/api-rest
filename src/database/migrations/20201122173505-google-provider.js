'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('google_providers', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        unique: true,
      },
      account_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'accounts',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async queryInterface => {
    return await queryInterface.dropTable('google_providers');
  },
};
