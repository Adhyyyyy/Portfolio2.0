const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { 
      type: String, 
      required: true, 
      enum: ['programming', 'framework', 'database', 'tool', 'other'] 
    },
    proficiency: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 10,
      default: 5
    },
    icon: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
