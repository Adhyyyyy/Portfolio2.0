const Blog = require('../models/Blog');

// Get all blog posts (admin)
async function getAllBlogPosts(req, res) {
  try {
    const posts = await Blog.find().sort({ publishedAt: -1, createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
}

// Get public blog posts
async function getPublicBlogPosts(req, res) {
  try {
    const posts = await Blog.find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
}

// Get single blog post by slug
async function getBlogPostBySlug(req, res) {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
}

// Get single blog post by ID (admin)
async function getBlogPost(req, res) {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
}

// Create blog post
async function createBlogPost(req, res) {
  try {
    const postData = { ...req.body };
    
    // Set publishedAt if publishing
    if (postData.published && !postData.publishedAt) {
      postData.publishedAt = new Date();
    }
    
    const post = new Blog(postData);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error creating blog post', error: error.message });
  }
}

// Update blog post
async function updateBlogPost(req, res) {
  try {
    const updateData = { ...req.body };
    
    // Set publishedAt if publishing for the first time
    if (updateData.published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }
    
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error updating blog post', error: error.message });
  }
}

// Delete blog post
async function deleteBlogPost(req, res) {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
}

// Toggle publish status
async function togglePublishStatus(req, res) {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    post.published = !post.published;
    if (post.published && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling publish status', error: error.message });
  }
}

module.exports = {
  getAllBlogPosts,
  getPublicBlogPosts,
  getBlogPostBySlug,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  togglePublishStatus
};
