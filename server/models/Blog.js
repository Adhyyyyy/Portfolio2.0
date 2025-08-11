const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, sparse: true },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 300, default: '' },
    tags: [{ type: String, trim: true }],
    imageUrl: { type: String },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  // Always generate slug if title exists
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
