'use strict';
const {Model} = require('sequelize');
const randomToken = require('rand-token');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  }
  RefreshToken.init(
    {
      id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
        defaultValue: randomToken.uid(255),
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
      expiration_datetime: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      issued_tokens: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return RefreshToken;
};
