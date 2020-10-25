'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'email_tokens',
        {
          id: {
            type: Sequelize.STRING(255),
            primaryKey: true,
            unique: true,
          },
          email_provider_id: {
            type: Sequelize.BIGINT,
            references: {
              model: 'email_providers',
              key: 'id',
            },
            allowNull: true,
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          valid: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          expiration_datetime: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },
          times_used: {
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

      await queryInterface.addIndex('email_tokens', ['expiration_datetime', 'valid'], {transaction});

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async queryInterface => {
    await queryInterface.dropTable('email_tokens');
  },
};
