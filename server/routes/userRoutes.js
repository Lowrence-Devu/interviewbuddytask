const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUsersByOrganization,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  validateUser
} = require('../controllers/userController');

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/organization/:orgId - Get users by organization
router.get('/organization/:orgId', getUsersByOrganization);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user
router.post('/', validateUser, createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateUser, updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

module.exports = router;
