const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // E001, T001, etc.
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CEO', 'Employee', 'Team Leader'], required: true }
});


userSchema.methods.comparePassword = function (candidatePassword) {
  return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
