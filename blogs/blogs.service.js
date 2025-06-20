const { isValidObjectId } = require('mongoose');
const blogModel = require('../models/blog.model');
const userModel = require('../models/user.model');

const findAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate('author', 'name email profilePhoto').sort({_id: -1});
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const findBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid blog ID' });

    const blog = await blogModel.findById(id).populate('author', 'name email profilePhoto');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBlog = async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    const imageUrl = req.file ? req.file.path : undefined;

    const blogData = {
      title,
      content,
      author: req.userId,
    };
    if (imageUrl) blogData.image = imageUrl; 
    const blog = await blogModel.create(blogData);
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid blog ID' });

    const blog = await blogModel.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.userId) 
      return res.status(403).json({ message: 'This blog is not yours' });

    await blogModel.findByIdAndDelete(id);
    await userModel.findByIdAndUpdate(req.userId, { $pull: { blogs: id } });

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await blogModel.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.userId) 
      return res.status(403).json({ message: 'This blog is not yours' });

    const { title, content } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (req.file) blog.image = req.file.path;

    const updatedBlog = await blog.save();

    res.json({ message: 'Blog updated successfully', data: updatedBlog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  findAllBlogs,
  findBlogById,
  createBlog,
  deleteBlogById,
  updateBlogById,
};