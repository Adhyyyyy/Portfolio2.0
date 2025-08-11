const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  getAllProjects,
  getPublicProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');

const router = express.Router();

// Public routes
router.get('/public', getPublicProjects);
router.get('/:id', getProject);

// Protected admin routes
router.get('/', requireAuth, getAllProjects);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

module.exports = router;
