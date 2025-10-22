const { body, validationResult } = require('express-validator');
const Organization = require('../models/organizationModel');
const User = require('../models/userModel');

// Validation middleware
const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('User name must be between 1 and 255 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('role')
    .isIn(['Admin', 'Member'])
    .withMessage('Role must be either Admin or Member'),
  body('org_id')
    .isInt({ min: 1 })
    .withMessage('Valid organization ID is required')
];

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

// Get users by organization
const getUsersByOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const users = await User.findAll({
      where: { org_id: orgId },
      include: [{
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users by organization:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [{
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name']
      }]
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, role, org_id } = req.body;

    // Check if organization exists
    const organization = await Organization.findByPk(org_id);
    if (!organization) {
      return res.status(400).json({
        status: 'error',
        message: 'Organization not found'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      role,
      org_id
    });

    // Fetch user with organization details
    const userWithOrg = await User.findByPk(user.user_id, {
      include: [{
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name']
      }]
    });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: userWithOrg
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create user'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, email, role, org_id } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if organization exists
    const organization = await Organization.findByPk(org_id);
    if (!organization) {
      return res.status(400).json({
        status: 'error',
        message: 'Organization not found'
      });
    }

    // Check if email already exists (excluding current user)
    const existingUser = await User.findOne({ 
      where: { 
        email,
        user_id: { [require('sequelize').Op.ne]: id }
      } 
    });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists'
      });
    }

    await user.update({ name, email, role, org_id });

    // Fetch updated user with organization details
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name']
      }]
    });

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    await user.destroy();

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
};

module.exports = {
  getAllUsers,
  getUsersByOrganization,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  validateUser
};
