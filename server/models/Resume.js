const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    version: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Ensure only one resume is active at a time
resumeSchema.pre('save', async function(next) {
  if (this.active) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { active: false }
    );
  }
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
