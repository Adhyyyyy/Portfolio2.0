const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  getAllSkills,
  getPublicSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skill.controller');

const router = express.Router();

// Public routes
router.get('/public', getPublicSkills);
router.get('/:id', getSkill);

// Protected admin routes
router.get('/', requireAuth, getAllSkills);
router.post('/', requireAuth, createSkill);
router.put('/:id', requireAuth, updateSkill);
router.delete('/:id', requireAuth, deleteSkill);

module.exports = router;
