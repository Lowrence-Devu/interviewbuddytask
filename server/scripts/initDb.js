const sequelize = require('../config/db');
const { Organization, User } = require('../models');

const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models (create tables)
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');

    // Check if we have any data
    const orgCount = await Organization.count();
    const userCount = await User.count();

    if (orgCount === 0 && userCount === 0) {
      console.log('No data found. Creating sample data...');
      
      // Create sample organizations
      const org1 = await Organization.create({
        name: 'Tech Solutions Inc.',
        address: '123 Tech Street, Silicon Valley, CA 94000'
      });

      const org2 = await Organization.create({
        name: 'Digital Innovations Ltd.',
        address: '456 Innovation Drive, Austin, TX 78701'
      });

      const org3 = await Organization.create({
        name: 'Future Systems Corp.',
        address: '789 Future Avenue, Seattle, WA 98101'
      });

      // Create sample users
      await User.create({
        name: 'John Smith',
        email: 'john.smith@techsolutions.com',
        role: 'Admin',
        org_id: org1.org_id
      });

      await User.create({
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techsolutions.com',
        role: 'Member',
        org_id: org1.org_id
      });

      await User.create({
        name: 'Mike Davis',
        email: 'mike.davis@digitalinnovations.com',
        role: 'Admin',
        org_id: org2.org_id
      });

      await User.create({
        name: 'Emily Brown',
        email: 'emily.brown@digitalinnovations.com',
        role: 'Member',
        org_id: org2.org_id
      });

      await User.create({
        name: 'David Wilson',
        email: 'david.wilson@futuresystems.com',
        role: 'Admin',
        org_id: org3.org_id
      });

      await User.create({
        name: 'Lisa Anderson',
        email: 'lisa.anderson@futuresystems.com',
        role: 'Member',
        org_id: org3.org_id
      });

      console.log('Sample data created successfully!');
    } else {
      console.log(`Database already contains ${orgCount} organizations and ${userCount} users.`);
    }

  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase().then(() => {
    console.log('Database initialization completed.');
    process.exit(0);
  }).catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
}

module.exports = initializeDatabase;
