const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  getAllBlogPosts,
  getPublicBlogPosts,
  getBlogPostBySlug,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  togglePublishStatus
} = require('../controllers/blog.controller');

const router = express.Router();

// Public routes
router.get('/public', getPublicBlogPosts);
router.get('/public/:slug', getBlogPostBySlug);

// Protected admin routes
router.get('/', requireAuth, getAllBlogPosts);
router.get('/:id', requireAuth, getBlogPost);
router.post('/', requireAuth, createBlogPost);
router.put('/:id', requireAuth, updateBlogPost);
router.delete('/:id', requireAuth, deleteBlogPost);
router.patch('/:id/toggle-publish', requireAuth, togglePublishStatus);

module.exports = router;
