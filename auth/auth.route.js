const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');
dotenv.config();

const router = Router();

router.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) 
    return res.status(400).json({ message: 'email, password and name are required' });

  const existingUser = await User.findOne({ email });
  if (existingUser) 
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, name, password: hashedPassword });

  res.status(201).json({ 
    message: 'User created successfully',
    userId: newUser._id
  });
});

router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) 
    return res.status(400).json({ message: 'email and password are required' });

  const user = await User.findOne({ email });
  if (!user) 
    return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) 
    return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

module.exports = router;
