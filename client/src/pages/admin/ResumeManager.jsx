import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function ResumeManager() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResume, setEditingResume] = useState(null);
  const [formData, setFormData] = useState({
    version: '',
    description: '',
    active: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    try {
      const { data } = await api.get('/resume');
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!selectedFile && !editingResume) {
      alert('Please select a PDF file');
      return;
    }

    if (editingResume) {
      updateResume(editingResume._id, formData);
    } else {
      createResume(formData);
    }
  }

  async function createResume(data) {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', selectedFile);
      formDataToSend.append('version', data.version);
      formDataToSend.append('description', data.description);
      formDataToSend.append('active', data.active);

      const response = await api.post('/resume', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      console.log('Resume created:', response.data);
      setShowForm(false);
      resetForm();
      fetchResumes();
      setUploadProgress(0);
    } catch (error) {
      console.error('Error creating resume:', error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error creating resume. Please check the console for details.');
      }
      setUploadProgress(0);
    }
  }

  async function updateResume(id, data) {
    try {
      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append('resume', selectedFile);
      }
      formDataToSend.append('version', data.version);
      formDataToSend.append('description', data.description);
      formDataToSend.append('active', data.active);

      const response = await api.put(`/resume/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Resume updated:', response.data);
      setShowForm(false);
      setEditingResume(null);
      resetForm();
      fetchResumes();
    } catch (error) {
      console.error('Error updating resume:', error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error updating resume. Please check the console for details.');
      }
    }
  }

  async function deleteResume(id) {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  }

  async function toggleActiveStatus(id) {
    try {
      await api.patch(`/resume/${id}/toggle-active`);
      fetchResumes();
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  }

  function editResume(resume) {
    setEditingResume(resume);
    setFormData({
      version: resume.version || '',
      description: resume.description || '',
      active: resume.active
    });
    setSelectedFile(null);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      version: '',
      description: '',
      active: false
    });
    setSelectedFile(null);
    setEditingResume(null);
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) return <div className="text-center py-8">Loading resumes...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Resume Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
        >
          Upload New Resume
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">
            {editingResume ? 'Edit Resume' : 'Upload New Resume'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingResume && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Resume File (PDF) * <span className="text-red-500">(Required)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  Only PDF files allowed, max 5MB
                </div>
              </div>
            )}

            {editingResume && selectedFile && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Resume File (PDF) <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full border rounded px-3 py-2"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Only PDF files allowed, max 5MB
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Version</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., 1.0, 2.1, Latest"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Brief description of this version"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2"
                />
                Set as active resume (will deactivate others)
              </label>
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-brand-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">
                  Uploading: {uploadProgress}%
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
                disabled={uploadProgress > 0}
              >
                {editingResume ? 'Update Resume' : 'Upload Resume'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={uploadProgress > 0}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {resumes.map((resume) => (
          <div key={resume._id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium">{resume.originalName}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    resume.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {resume.active ? 'Active' : 'Inactive'}
                  </span>
                  {resume.version && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      v{resume.version}
                    </span>
                  )}
                </div>
                
                {resume.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{resume.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Size: {formatFileSize(resume.fileSize)}</span>
                  <span>Type: {resume.mimeType}</span>
                  <span>Downloads: {resume.downloadCount || 0}</span>
                  <span>Created: {formatDate(resume.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleActiveStatus(resume._id)}
                  className={`px-3 py-1 text-sm border rounded ${
                    resume.active 
                      ? 'text-yellow-600 hover:bg-yellow-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {resume.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => editResume(resume)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteResume(resume._id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {resumes.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No resumes found. Upload your first resume!
        </div>
      )}
    </div>
  );
}
