import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    imageUrl: '',
    published: false,
    featured: false
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data } = await api.get('/blog');
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields: Title and Content');
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
      excerpt: formData.excerpt.trim() || '',
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      imageUrl: formData.imageUrl.trim() || undefined
    };

    if (editingPost) {
      updatePost(editingPost._id, submitData);
    } else {
      createPost(submitData);
    }
  }

  async function createPost(data) {
    try {
      const response = await api.post('/blog', data);
      console.log('Blog post created:', response.data);
      setShowForm(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error creating blog post:', error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error creating blog post. Please check the console for details.');
      }
    }
  }

  async function updatePost(id, data) {
    try {
      const response = await api.put(`/blog/${id}`, data);
      console.log('Blog post updated:', response.data);
      setShowForm(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error updating blog post:', error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error updating blog post. Please check the console for details.');
      }
    }
  }

  async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  }

  async function togglePublishStatus(id) {
    try {
      await api.patch(`/blog/${id}/toggle-publish`);
      fetchPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  }

  function editPost(post) {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      tags: post.tags ? post.tags.join(', ') : '',
      imageUrl: post.imageUrl || '',
      published: post.published,
      featured: post.featured
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      imageUrl: '',
      published: false,
      featured: false
    });
  }

  function formatDate(dateString) {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function truncateText(text, maxLength = 150) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  if (loading) return <div className="text-center py-8">Loading blog posts...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blog Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
        >
          Create New Post
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-4">
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title * <span className="text-red-500">(Required)</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter blog post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Excerpt <span className="text-gray-500">(Optional, max 300 chars)</span>
              </label>
              <textarea
                maxLength={300}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full border rounded px-3 py-2 h-20"
                placeholder="Brief summary of the post (max 300 characters)..."
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length}/300 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Content * <span className="text-red-500">(Required)</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full border rounded px-3 py-2 h-40"
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., react, javascript, web-dev (comma separated)"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </div>
              </div>
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
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                Publish immediately
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured post
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
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
        {posts.map((post) => (
          <div key={post._id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium">{post.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    post.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  {post.featured && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Featured
                    </span>
                  )}
                </div>
                
                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{post.excerpt}</p>
                )}
                
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {truncateText(post.content)}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Created: {formatDate(post.createdAt)}</span>
                  {post.published && (
                    <span>Published: {formatDate(post.publishedAt)}</span>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <span>Tags: {post.tags.join(', ')}</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => togglePublishStatus(post._id)}
                  className={`px-3 py-1 text-sm border rounded ${
                    post.published 
                      ? 'text-yellow-600 hover:bg-yellow-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => editPost(post)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post._id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No blog posts found. Create your first post!
        </div>
      )}
    </div>
  );
}
