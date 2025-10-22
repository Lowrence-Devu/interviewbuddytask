const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Organization = sequelize.define('Organization', {
  org_id: {
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
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'organizations',
  timestamps: false,
  indexes: [
    {
      fields: ['name']
    }
  ]
});

module.exports = Organization;
