// File: /backend/src/tests/authController.test.js

const httpMocks = require('node-mocks-http');
const authController = require('../controllers/authController');
const userModel = require('../models/userModel');
const admin = require('../config/firebaseConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mailer');

// Mock all external dependencies
jest.mock('../models/userModel');
jest.mock('../config/firebaseConfig');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/mailer');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mock call counts and implementations before each test
    jest.clearAllMocks();

    // Create a mock request, response, and next function for each test
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    // Set up mock Firebase Admin SDK
    admin.auth = jest.fn(() => ({
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      generateEmailVerificationLink: jest.fn(),
      verifyActionCode: jest.fn(),
      applyActionCode: jest.fn(),
    }));
  });

  describe('registerUser', () => {
    it('should register a new user and return a 201 status', async () => {
      // Mock request body
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
      };

      // Mock dependencies' responses
      bcrypt.hash.mockResolvedValue('hashed_password');
      admin.auth().createUser.mockResolvedValue({ uid: 'firebase_uid' });
      userModel.create.mockResolvedValue({ id: 1, email: 'test@example.com' });
      admin.auth().generateEmailVerificationLink.mockResolvedValue('http://mock-link');
      mailer.sendEmail.mockResolvedValue(true);

      await authController.registerUser(req, res, next);

      // Verify that the necessary functions were called with the correct arguments
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(admin.auth().createUser).toHaveBeenCalledTimes(1);
      expect(userModel.create).toHaveBeenCalledWith({
        firebase_uid: 'firebase_uid',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        full_name: 'Test User',
        mobile_no: undefined,
        gender: null,
        signup_type: 'e',
        is_email_verified: false,
        is_mobile_verified: false,
      });
      expect(mailer.sendEmail).toHaveBeenCalledTimes(1);

      // Verify the response status and JSON payload
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        message: 'User registered successfully. An email verification link has been sent to your inbox. Please also verify your mobile number.',
        user: {
          id: 1,
          email: 'test@example.com',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 409 status if the email already exists', async () => {
      req.body = { email: 'existing@example.com', password: 'password123' };

      // Mock Firebase user creation to throw an error for an existing email
      admin.auth().createUser.mockRejectedValue({ code: 'auth/email-already-exists' });

      await authController.registerUser(req, res, next);

      // Verify the response
      expect(res.statusCode).toBe(409);
      expect(res._getJSONData()).toEqual({ message: 'Email already in use.' });
      expect(userModel.create).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 400 status if password is not provided', async () => {
      req.body = { email: 'test@example.com' };

      await authController.registerUser(req, res, next);

      // Verify the response
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Password is required.' });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should successfully log in a user and return a token', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const userRecord = { uid: 'firebase_uid' };
      const localUser = { id: 1, email: 'test@example.com' };
      const token = 'mock_jwt_token';

      // Mock dependencies' responses
      admin.auth().getUserByEmail.mockResolvedValue(userRecord);
      userModel.findByFirebaseUid.mockResolvedValue(localUser);
      jwt.sign.mockReturnValue(token);

      await authController.loginUser(req, res, next);

      // Verify the function calls and the response
      expect(admin.auth().getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userModel.findByFirebaseUid).toHaveBeenCalledWith('firebase_uid');
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: 'Login successful.',
        token,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 401 status for invalid credentials (Firebase error)', async () => {
      req.body = { email: 'wrong@example.com', password: 'wrongpassword' };
      admin.auth().getUserByEmail.mockRejectedValue({ code: 'auth/user-not-found' });

      await authController.loginUser(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ message: 'Invalid credentials.' });
      expect(userModel.findByFirebaseUid).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 404 status if user not found in local database', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      admin.auth().getUserByEmail.mockResolvedValue({ uid: 'firebase_uid' });
      userModel.findByFirebaseUid.mockResolvedValue(null);

      await authController.loginUser(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'User not found in local database.' });
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email and update user status', async () => {
      req.query = { oobCode: 'mock-oob-code' };
      const email = 'test@example.com';
      const user = { id: 1, email };

      // Mock dependencies' responses
      admin.auth().verifyActionCode.mockResolvedValue(email);
      admin.auth().applyActionCode.mockResolvedValue();
      userModel.findByEmail.mockResolvedValue(user);
      userModel.updateEmailVerificationStatus.mockResolvedValue();

      await authController.verifyEmail(req, res, next);

      // Verify the function calls and the response
      expect(admin.auth().verifyActionCode).toHaveBeenCalledWith('mock-oob-code');
      expect(admin.auth().applyActionCode).toHaveBeenCalledWith('mock-oob-code');
      expect(userModel.findByEmail).toHaveBeenCalledWith(email);
      expect(userModel.updateEmailVerificationStatus).toHaveBeenCalledWith(user.id);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'Email verified successfully.' });
    });

    it('should return a 400 status for an invalid verification link', async () => {
      req.query = { oobCode: 'invalid-oob-code' };
      admin.auth().verifyActionCode.mockRejectedValue(new Error('Invalid action code'));

      await authController.verifyEmail(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Invalid or expired email verification link.' });
      expect(userModel.findByEmail).not.toHaveBeenCalled();
    });
  });

  describe('verifyMobile', () => {
    it('should successfully verify mobile number and update user status', async () => {
      req.body = { firebase_uid: 'firebase_uid' };
      const user = { id: 1, email: 'test@example.com' };

      // Mock dependencies' responses
      userModel.findByFirebaseUid.mockResolvedValue(user);
      userModel.updateMobileVerificationStatus.mockResolvedValue();

      await authController.verifyMobile(req, res, next);

      // Verify the function calls and the response
      expect(userModel.findByFirebaseUid).toHaveBeenCalledWith('firebase_uid');
      expect(userModel.updateMobileVerificationStatus).toHaveBeenCalledWith(user.id);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'Mobile number verified successfully.' });
    });

    it('should return a 400 status if mobile verification fails', async () => {
      req.body = { firebase_uid: 'non-existent-uid' };
      userModel.findByFirebaseUid.mockResolvedValue(null);

      await authController.verifyMobile(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Failed to verify mobile number.' });
      expect(userModel.updateMobileVerificationStatus).not.toHaveBeenCalled();
    });
  });
});
