'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailProvider extends Model {
    static associate(models) {
      EmailProvider.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      EmailProvider.hasMany(models.EmailToken, {
        foreignKey: 'email_provider_id',
        as: 'tokens',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  }
  EmailProvider.init(
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
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EmailProvider',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return EmailProvider;
};
