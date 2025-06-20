const { isValidObjectId } = require('mongoose');
const userModel = require('../models/user.model');
const blogModel = require('../models/blog.model');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()
      .select('-password')
      .populate('blogs', '-author');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user ID' });

    const user = await userModel.findById(id)
      .select('-password')
      .populate('blogs', '-author');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const id = req.userId;
    const { email, name } = req.body;
    const avatar = req.file?.path;

    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user ID' });

    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (avatar) updateData.profilePhoto = avatar;

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated', data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user ID' });
    if (id !== req.userId) return res.status(401).json({ message: 'Unauthorized' });

    const deletedUser = await userModel.findByIdAndDelete(id);
    await blogModel.deleteMany({ author: id });

    res.json({ message: 'User deleted successfully', data: deletedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
