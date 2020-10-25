'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailToken extends Model {
    static associate(models) {
      EmailToken.belongsTo(models.EmailProvider, {
        foreignKey: 'email_provider_id',
        as: 'email_providers',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  }
  EmailToken.init(
    {
      id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      email_provider_id: {
        type: DataTypes.BIGINT,
        references: {
          model: 'email_providers',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expiration_datetime: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      times_used: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'EmailToken',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return EmailToken;
};
