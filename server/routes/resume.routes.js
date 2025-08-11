const express = require('express');
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../middleware/auth');
const {
  getAllResumes,
  getActiveResume,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  toggleActiveStatus,
  downloadResume
} = require('../controllers/resume.controller');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.get('/active', getActiveResume);
router.get('/:id/download', downloadResume);

// Protected admin routes
router.get('/', requireAuth, getAllResumes);
router.get('/:id', requireAuth, getResume);
router.post('/', requireAuth, upload.single('resume'), createResume);
router.put('/:id', requireAuth, upload.single('resume'), updateResume);
router.delete('/:id', requireAuth, deleteResume);
router.patch('/:id/toggle-active', requireAuth, toggleActiveStatus);

module.exports = router;
