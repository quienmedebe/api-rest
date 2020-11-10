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
      Account.hasMany(models.RefreshToken, {
        foreignKey: 'account_id',
        as: 'refresh_tokens',
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
      public_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
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
