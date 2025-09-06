const User = require('../models/user');

// Fetch email by userId
exports.getEmailByUserId = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json({ success: false, message: 'User ID required' });

  try {
    const user = await User.findOne({ userId });
    if (user) {
      res.json({ success: true, email: user.email });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Server error', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
  res.json({ success: true, message: 'Login successful!', name: user.name, role: user.role });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Signup
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already Registered!' });
    }

    // Role prefix
    let prefix = '';
    if (role === 'Employee') prefix = 'E';
    else if (role === 'Team Leader') prefix = 'T';
    else if (role === 'CEO') prefix = 'C';
    else prefix = 'U';

    // Get last userId for this role
    const lastUser = await User.find({ userId: { $regex: `^${prefix}` } })
      .sort({ userId: -1 })
      .limit(1);

    let nextNum = 1;
    if (lastUser.length > 0) {
      const lastId = lastUser[0].userId;
      const num = parseInt(lastId.replace(prefix, ''), 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    const userId = `${prefix}${String(nextNum).padStart(3, '0')}`;

    // Create new user
    const newUser = new User({ userId, name, email, password, role });
    await newUser.save();

    res.json({ success: true, message: 'Signup successful!', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during password reset.', error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
