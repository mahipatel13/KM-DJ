const Project = require('../models/project');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, desc, deadline, budget, leader } = req.body;
    const project = new Project({ name, desc, deadline, budget, leader });
    await project.save();
    res.json({ success: true, message: 'Project created successfully!', project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
