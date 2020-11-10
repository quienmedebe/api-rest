'use strict';
const {v4} = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        'accounts',
        'public_id',
        {
          type: Sequelize.UUID,
          after: 'id',
          allowNull: true,
          unique: true,
          defaultValue: Sequelize.UUIDV4,
        },
        {transaction}
      );
      await queryInterface.addColumn(
        'email_providers',
        'public_id',
        {
          type: Sequelize.UUID,
          after: 'id',
          allowNull: true,
          unique: true,
          defaultValue: Sequelize.UUIDV4,
        },
        {transaction}
      );

      await queryInterface.bulkUpdate(
        'accounts',
        {
          public_id: v4(),
        },
        {},
        {transaction}
      );
      await queryInterface.bulkUpdate(
        'email_providers',
        {
          public_id: v4(),
        },
        {},
        {transaction}
      );

      await queryInterface.changeColumn(
        'accounts',
        'public_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          after: 'id',
          unique: true,
          defaultValue: Sequelize.UUIDV4,
        },
        {transaction}
      );
      await queryInterface.changeColumn(
        'email_providers',
        'public_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          after: 'id',
          unique: true,
          defaultValue: Sequelize.UUIDV4,
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
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('email_providers', 'public_id', {transaction});
      await queryInterface.removeColumn('accounts', 'public_id', {transaction});

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
