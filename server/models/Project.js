const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    technologies: [{ type: String, trim: true }],
    imageUrl: { type: String },
    githubUrl: { type: String },
    liveUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    category: { type: String, enum: ['web', 'mobile', 'ai-ml', 'other'], default: 'web' },
    status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
