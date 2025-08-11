import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'programming',
    proficiency: 5,
    icon: '',
    description: '',
    featured: false
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingSkill) {
      updateSkill(editingSkill._id, formData);
    } else {
      createSkill(formData);
    }
  }

  async function createSkill(data) {
    try {
      await api.post('/skills', data);
      setShowForm(false);
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Error creating skill:', error);
    }
  }

  async function updateSkill(id, data) {
    try {
      await api.put(`/skills/${id}`, data);
      setShowForm(false);
      setEditingSkill(null);
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  }

  async function deleteSkill(id) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  }

  function editSkill(skill) {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
      description: skill.description || '',
      featured: skill.featured
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      name: '',
      category: 'programming',
      proficiency: 5,
      icon: '',
      description: '',
      featured: false
    });
  }

  function getCategoryLabel(category) {
    const labels = {
      programming: 'Programming Languages',
      framework: 'Frameworks & Libraries',
      database: 'Databases & Backend',
      tool: 'Development Tools',
      other: 'Other Skills'
    };
    return labels[category] || category;
  }

  function getProficiencyColor(level) {
    if (level >= 8) return 'text-green-600 bg-green-100';
    if (level >= 6) return 'text-blue-600 bg-blue-100';
    if (level >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  if (loading) return <div className="text-center py-8">Loading skills...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Skills Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
        >
          Add New Skill
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="programming">Programming Languages</option>
                  <option value="framework">Frameworks & Libraries</option>
                  <option value="database">Databases & Backend</option>
                  <option value="tool">Development Tools</option>
                  <option value="other">Other Skills</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Proficiency Level *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-medium w-8 text-center">{formData.proficiency}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  1 = Beginner, 5 = Intermediate, 10 = Expert
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon (optional)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., 💻, ⚛️, 🗄️"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded px-3 py-2 h-20"
                placeholder="Brief description of the skill..."
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured Skill (show on public portfolio)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
              >
                {editingSkill ? 'Update Skill' : 'Create Skill'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSkill(null);
                  resetForm();
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {skills.map((skill) => (
          <div key={skill._id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{skill.icon || '💻'}</span>
                  <h3 className="text-lg font-medium">{skill.name}</h3>
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700">
                    {getCategoryLabel(skill.category)}
                  </span>
                  {skill.featured && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Featured
                    </span>
                  )}
                </div>
                {skill.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{skill.description}</p>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Proficiency:</span>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${getProficiencyColor(skill.proficiency)}`}>
                      {skill.proficiency}/10
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(skill.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => editSkill(skill)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSkill(skill._id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No skills found. Add your first skill!
        </div>
      )}
    </div>
  );
}
