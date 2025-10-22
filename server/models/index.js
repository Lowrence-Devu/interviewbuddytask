const Organization = require('./organizationModel');
const User = require('./userModel');

// Define associations
Organization.hasMany(User, {
  foreignKey: 'org_id',
  as: 'users',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

User.belongsTo(Organization, {
  foreignKey: 'org_id',
  as: 'organization'
});

module.exports = {
  Organization,
  User
};
