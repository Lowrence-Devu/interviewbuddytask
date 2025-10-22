const { body, validationResult } = require('express-validator');
const Organization = require('../models/organizationModel');
const User = require('../models/userModel');

// Validation middleware
const validateOrganization = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Organization name must be between 1 and 255 characters'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Organization address is required')
];

// Get all organizations
const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: ['user_id', 'name', 'email', 'role']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: organizations
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch organizations'
    });
  }
};

// Get organization by ID
const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['user_id', 'name', 'email', 'role']
      }]
    });

    if (!organization) {
      return res.status(404).json({
        status: 'error',
        message: 'Organization not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch organization'
    });
  }
};

// Create new organization
const createOrganization = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, address } = req.body;
    const organization = await Organization.create({
      name,
      address
    });

    res.status(201).json({
      status: 'success',
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create organization'
    });
  }
};

// Update organization
const updateOrganization = async (req, res) => {
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
    const { name, address } = req.body;

    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({
        status: 'error',
        message: 'Organization not found'
      });
    }

    await organization.update({ name, address });

    res.status(200).json({
      status: 'success',
      message: 'Organization updated successfully',
      data: organization
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update organization'
    });
  }
};

// Delete organization
const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({
        status: 'error',
        message: 'Organization not found'
      });
    }

    // Check if organization has users
    const userCount = await User.count({ where: { org_id: id } });
    if (userCount > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete organization with existing users. Please delete users first.'
      });
    }

    await organization.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete organization'
    });
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  validateOrganization
};
