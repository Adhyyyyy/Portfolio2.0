const Skill = require('../models/Skill');

// Get all skills (admin)
async function getAllSkills(req, res) {
  try {
    const skills = await Skill.find().sort({ order: 1, category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
}

// Get public skills
async function getPublicSkills(req, res) {
  try {
    const skills = await Skill.find({ featured: true })
      .sort({ order: 1, category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
}

// Get single skill
async function getSkill(req, res) {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skill', error: error.message });
  }
}

// Create skill
async function createSkill(req, res) {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: 'Error creating skill', error: error.message });
  }
}

// Update skill
async function updateSkill(req, res) {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: 'Error updating skill', error: error.message });
  }
}

// Delete skill
async function deleteSkill(req, res) {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
}

module.exports = {
  getAllSkills,
  getPublicSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
};
