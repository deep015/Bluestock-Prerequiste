// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ Import CORS
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const companyProfileRoutes = require('./routes/companyProfileRoutes');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const app = express();
const PORT = 3000;

// ✅ Enable CORS for all requests
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));

app.use(express.json());

// DB Connection check
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB not connected:', err);
  } else {
    console.log('✅ DB connected at:', res.rows[0].now);
  }
});

// Test route: Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/company', companyProfileRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
