const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Member'),
    allowNull: false,
    defaultValue: 'Member'
  },
  org_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'organizations',
      key: 'org_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['org_id']
    },
    {
      fields: ['role']
    }
  ]
});

module.exports = User;
