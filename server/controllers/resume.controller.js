const Resume = require('../models/Resume');
const fs = require('fs').promises;
const path = require('path');

// Get all resumes (admin)
async function getAllResumes(req, res) {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
}

// Get active resume (public)
async function getActiveResume(req, res) {
  try {
    const resume = await Resume.findOne({ active: true });
    if (!resume) {
      return res.status(404).json({ message: 'No active resume found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active resume', error: error.message });
  }
}

// Get single resume by ID (admin)
async function getResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
}

// Create resume
async function createResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resumeData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      version: req.body.version || '1.0',
      description: req.body.description || '',
      active: req.body.active === 'true'
    };

    const resume = new Resume(resumeData);
    await resume.save();
    
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: 'Error creating resume', error: error.message });
  }
}

// Update resume
async function updateResume(req, res) {
  try {
    const updateData = { ...req.body };
    
    // Handle file upload if new file is provided
    if (req.file) {
      updateData.filename = req.file.filename;
      updateData.originalName = req.file.originalname;
      updateData.fileSize = req.file.size;
      updateData.mimeType = req.file.mimetype;
    }

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: 'Error updating resume', error: error.message });
  }
}

// Delete resume
async function deleteResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(__dirname, '../uploads', resume.filename);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn('Could not delete file:', fileError.message);
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
}

// Toggle active status
async function toggleActiveStatus(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    resume.active = !resume.active;
    await resume.save();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling active status', error: error.message });
  }
}

// Download resume (increment download count)
async function downloadResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Increment download count
    resume.downloadCount = (resume.downloadCount || 0) + 1;
    await resume.save();

    // Send file
    const filePath = path.join(__dirname, '../uploads', resume.filename);
    res.download(filePath, resume.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading resume', error: error.message });
  }
}

module.exports = {
  getAllResumes,
  getActiveResume,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  toggleActiveStatus,
  downloadResume
};
