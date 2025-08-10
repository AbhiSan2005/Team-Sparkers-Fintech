// server.js
const express = require('express');
const cors = require('cors');
const branchRoutes = require('./routes/branches');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/branches', branchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});