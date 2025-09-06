const User = require('../models/user');
// Get teams by leader name
exports.getTeamsByLeader = async (req, res) => {
  try {
    const { leader } = req.query;
    const teams = await Team.find({ leader }).populate('members');
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Update team members
exports.updateTeamMembers = async (req, res) => {
  try {
    const { teamId, memberIds } = req.body;
    const team = await Team.findByIdAndUpdate(teamId, { members: memberIds }, { new: true }).populate('members');
    res.json({ success: true, message: 'Team members updated!', team });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
const Team = require('../models/team');

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, desc, leader, deadline } = req.body;
    const team = new Team({ name, desc, leader, deadline });
    await team.save();
    res.json({ success: true, message: 'Team created successfully!', team });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
