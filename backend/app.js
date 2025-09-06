require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const projectRoutes = require('./routes/project');

// MongoDB connection
mongoose.connect(config.mongoUri).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());
// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
