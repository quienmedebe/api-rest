'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'refresh_tokens',
        {
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
          expiration_datetime: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },
          valid: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          issued_tokens: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
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

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async queryInterface => {
    await queryInterface.dropTable('refresh_tokens');
  },
};
