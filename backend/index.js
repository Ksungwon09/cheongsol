require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createTables } = require('./db');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Cheongsol Backend is running!');
});

// API routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const announcementRoutes = require('./routes/announcements');
app.use('/api/announcements', announcementRoutes);

const boothRoutes = require('./routes/booths');
app.use('/api/booths', boothRoutes);

const suggestionRoutes = require('./routes/suggestions');
app.use('/api/suggestions', suggestionRoutes);


const startServer = async () => {
  await createTables(); // Wait for DB setup to complete
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

startServer();