'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasMany(models.EmailProvider, {
        foreignKey: 'account_id',
        as: 'email_providers',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  }
  Account.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Account',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return Account;
};