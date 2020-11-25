'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AppleProvider extends Model {
    static associate(models) {
      AppleProvider.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  }
  AppleProvider.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
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
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'AppleProvider',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return AppleProvider;
};
