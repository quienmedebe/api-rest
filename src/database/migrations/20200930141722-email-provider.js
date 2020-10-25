'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'email_providers',
        {
          id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
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
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        },
        {transaction}
      );

      await queryInterface.addIndex('email_providers', ['email'], {transaction});

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async queryInterface => {
    return await queryInterface.dropTable('email_providers');
  },
};
