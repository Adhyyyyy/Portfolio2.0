import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    category: 'web',
    status: 'completed'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const submitData = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
    };

    if (editingProject) {
      updateProject(editingProject._id, submitData);
    } else {
      createProject(submitData);
    }
  }

  async function createProject(data) {
    try {
      await api.post('/projects', data);
      setShowForm(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }

  async function updateProject(id, data) {
    try {
      await api.put(`/projects/${id}`, data);
      setShowForm(false);
      setEditingProject(null);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  function editProject(project) {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      shortDescription: project.shortDescription,
      technologies: project.technologies.join(', '),
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured,
      category: project.category,
      status: project.status
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      technologies: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      category: 'web',
      status: 'completed'
    });
  }

  if (loading) return <div className="text-center py-8">Loading projects...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Project Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
        >
          Add New Project
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile Development</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Short Description *</label>
              <textarea
                required
                maxLength={200}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full border rounded px-3 py-2 h-20"
                placeholder="Brief description (max 200 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded px-3 py-2 h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Technologies</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="React, Node.js, MongoDB (comma separated)"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Live URL</label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured Project
              </label>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="border rounded px-3 py-1"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
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
        {projects.map((project) => (
          <div key={project._id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Category: {project.category} • Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => editProject(project)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project._id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No projects found. Create your first project!
        </div>
      )}
    </div>
  );
}
