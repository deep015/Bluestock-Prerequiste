// File: /backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_KEY;

const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];
  // The header should be in the format "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Authorization token missing.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      // This is the error you are seeing. It means the token is invalid or expired.
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user; // Attach the user payload to the request object
    next(); // Pass the request to the next middleware or controller
  });
};

module.exports = verifyToken;