'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addIndex('debts', ['type'], {transaction});

      await queryInterface.addColumn(
        'debts',
        'status',
        {
          type: Sequelize.ENUM('PENDING', 'PAID', 'UNPAID'),
          allowNull: false,
          defaultValue: 'PENDING',
          after: 'type',
        },
        {transaction}
      );

      await queryInterface.addIndex('debts', ['status'], {transaction});

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async queryInterface => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('debts', 'status', {transaction});
      await queryInterface.sequelize.query('DROP TYPE "enum_debts_status";', {transaction});
      await queryInterface.removeIndex('debts', ['type'], {transaction});

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
