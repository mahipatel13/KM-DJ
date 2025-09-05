const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const authRoutes = require('./routes/auth');

// MongoDB connection
mongoose.connect(config.mongoUri).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/auth', authRoutes);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
