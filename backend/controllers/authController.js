const User = require('../models/user');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    // Compare password with hashed password
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      res.json({ success: true, message: 'Login successful!' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (email && password && username) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Id is already Registered!' });
      }
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.json({ success: true, message: 'Signup successful!' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Missing fields' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // To prevent user enumeration, you might want to send a generic success message
      // even if the user is not found. For this example, we'll be explicit.
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.password = newPassword; // The pre-save hook will hash it
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
};
