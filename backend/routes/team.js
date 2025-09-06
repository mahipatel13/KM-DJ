const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Create a new team

router.post('/', teamController.createTeam);
// Get all teams
router.get('/', teamController.getAllTeams);
// Get teams by leader
router.get('/byleader', teamController.getTeamsByLeader);
// Update team members
router.put('/members', teamController.updateTeamMembers);

module.exports = router;
