const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String },
  deadline: { type: String },
  budget: { type: Number },
  leader: { type: String }, // store leader name
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
