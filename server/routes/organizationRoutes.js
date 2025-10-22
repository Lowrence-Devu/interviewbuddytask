const express = require('express');
const router = express.Router();
const {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  validateOrganization
} = require('../controllers/organizationController');

// GET /api/organizations - Get all organizations
router.get('/', getAllOrganizations);

// GET /api/organizations/:id - Get organization by ID
router.get('/:id', getOrganizationById);

// POST /api/organizations - Create new organization
router.post('/', validateOrganization, createOrganization);

// PUT /api/organizations/:id - Update organization
router.put('/:id', validateOrganization, updateOrganization);

// DELETE /api/organizations/:id - Delete organization
router.delete('/:id', deleteOrganization);

module.exports = router;
