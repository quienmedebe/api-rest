'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Debt extends Model {
    static associate(models) {
      Debt.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  }
  Debt.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      public_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      account_id: {
        type: DataTypes.BIGINT,
        references: {
          model: 'accounts',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('DEBT', 'CREDIT'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'UNPAID'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
    },
    {
      sequelize,
      modelName: 'Debt',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return Debt;
};
