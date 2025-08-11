// File: /backend/src/tests/authRoutes.test.js

const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const authController = require('../controllers/authController');

// Mock the controller to avoid running the actual business logic
jest.mock('../controllers/authController', () => ({
  registerUser: jest.fn((req, res) => res.status(201).json({ message: 'User registered' })),
  loginUser: jest.fn((req, res) => res.status(200).json({ message: 'Login successful' })),
  verifyEmail: jest.fn((req, res) => res.status(200).json({ message: 'Email verified' })),
}));

// Create a simple Express app to test the routes
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication API Routes', () => {
  beforeEach(() => {
    // Clear all mock call counts before each test
    jest.clearAllMocks();
  });

  it('should call registerUser controller on POST /api/auth/register', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    // Expect the registerUser controller function to have been called
    expect(authController.registerUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered');
  });

  it('should call loginUser controller on POST /api/auth/login', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    // Expect the loginUser controller function to have been called
    expect(authController.loginUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  it('should call verifyEmail controller on GET /api/auth/verify-email', async () => {
    const oobCode = 'mock-oob-code';

    const response = await request(app)
      .get(`/api/auth/verify-email?oobCode=${oobCode}`);

    // Expect the verifyEmail controller function to have been called
    expect(authController.verifyEmail).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email verified');
  });
});
