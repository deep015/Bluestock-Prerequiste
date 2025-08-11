// File: /backend/src/tests/userModel.test.js

const userModel = require('../models/userModel');
const db = require('../config/db');

// Mock the database client to prevent actual database calls during tests
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('User Model', () => {
  beforeEach(() => {
    // Clear all mock call counts and reset mock return values before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user and return the created user object', async () => {
      const newUser = {
        firebase_uid: 'firebase-uid-123',
        email: 'test@example.com',
        password_hash: 'hashed_password_123',
        full_name: 'Test User',
        mobile_no: '+1234567890',
        gender: 'Male',
        signup_type: 'e',
        is_email_verified: false,
        is_mobile_verified: false,
      };

      // Mock the database query function to return a success response
      const mockResult = {
        rows: [{ id: 1, ...newUser }],
      };
      db.query.mockResolvedValue(mockResult);

      const createdUser = await userModel.create(newUser);

      // Verify that db.query was called with the correct SQL query and parameters
      expect(db.query).toHaveBeenCalledWith(
        `INSERT INTO users (
            firebase_uid, email, password_hash, full_name, mobile_no, gender, signup_type, is_email_verified, is_mobile_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
        [
          newUser.firebase_uid,
          newUser.email,
          newUser.password_hash,
          newUser.full_name,
          newUser.mobile_no,
          newUser.gender,
          newUser.signup_type,
          newUser.is_email_verified,
          newUser.is_mobile_verified,
        ]
      );
      // Verify that the function returns the first row from the database result
      expect(createdUser).toEqual(mockResult.rows[0]);
    });
  });

  describe('findById', () => {
    it('should find a user by their primary key ID and return the user object', async () => {
      const userId = 1;
      const mockUser = { id: userId, email: 'test@example.com' };

      // Mock the database query function
      db.query.mockResolvedValue({ rows: [mockUser] });

      const foundUser = await userModel.findById(userId);

      // Verify the query call
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1;', [userId]);
      // Verify the returned user
      expect(foundUser).toEqual(mockUser);
    });

    it('should return null if no user is found by ID', async () => {
      const userId = 999;
      db.query.mockResolvedValue({ rows: [] });

      const foundUser = await userModel.findById(userId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1;', [userId]);
      expect(foundUser).toBeNull();
    });
  });

  describe('findByFirebaseUid', () => {
    it('should find a user by their Firebase UID and return the user object', async () => {
      const firebaseUid = 'firebase-uid-123';
      const mockUser = { id: 1, firebase_uid: firebaseUid };

      db.query.mockResolvedValue({ rows: [mockUser] });

      const foundUser = await userModel.findByFirebaseUid(firebaseUid);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE firebase_uid = $1;', [firebaseUid]);
      expect(foundUser).toEqual(mockUser);
    });

    it('should return null if no user is found by Firebase UID', async () => {
      const firebaseUid = 'non-existent-uid';
      db.query.mockResolvedValue({ rows: [] });

      const foundUser = await userModel.findByFirebaseUid(firebaseUid);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE firebase_uid = $1;', [firebaseUid]);
      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email and return the user object', async () => {
      const email = 'test@example.com';
      const mockUser = { id: 1, email };

      db.query.mockResolvedValue({ rows: [mockUser] });

      const foundUser = await userModel.findByEmail(email);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1;', [email]);
      expect(foundUser).toEqual(mockUser);
    });

    it('should return null if no user is found by email', async () => {
      const email = 'non-existent@example.com';
      db.query.mockResolvedValue({ rows: [] });

      const foundUser = await userModel.findByEmail(email);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1;', [email]);
      expect(foundUser).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user object', async () => {
      const userId = 1;
      const updateData = {
        full_name: 'Updated Name',
        mobile_no: '+9876543210',
      };
      const mockUpdatedUser = { id: userId, ...updateData };

      db.query.mockResolvedValue({ rows: [mockUpdatedUser] });

      const updatedUser = await userModel.update(userId, updateData);

      expect(db.query).toHaveBeenCalledWith(
        `UPDATE users SET full_name = $1, mobile_no = $2 WHERE id = $3 RETURNING *;`,
        [updateData.full_name, updateData.mobile_no, userId]
      );
      expect(updatedUser).toEqual(mockUpdatedUser);
    });

    it('should return null if no user is found for the update', async () => {
      const userId = 999;
      const updateData = { full_name: 'No User' };

      db.query.mockResolvedValue({ rows: [] });

      const updatedUser = await userModel.update(userId, updateData);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(updatedUser).toBeNull();
    });
  });

  describe('updateEmailVerificationStatus', () => {
    it('should update a user\'s email verification status to true', async () => {
      const userId = 1;
      const mockUpdatedUser = { id: userId, is_email_verified: true };

      db.query.mockResolvedValue({ rows: [mockUpdatedUser] });

      const updatedUser = await userModel.updateEmailVerificationStatus(userId);

      expect(db.query).toHaveBeenCalledWith(
        `UPDATE users SET is_email_verified = TRUE WHERE id = $1 RETURNING *;`,
        [userId]
      );
      expect(updatedUser).toEqual(mockUpdatedUser);
    });
  });

  describe('updateMobileVerificationStatus', () => {
    it('should update a user\'s mobile verification status to true', async () => {
      const userId = 1;
      const mockUpdatedUser = { id: userId, is_mobile_verified: true };

      db.query.mockResolvedValue({ rows: [mockUpdatedUser] });

      const updatedUser = await userModel.updateMobileVerificationStatus(userId);

      expect(db.query).toHaveBeenCalledWith(
        `UPDATE users SET is_mobile_verified = TRUE WHERE id = $1 RETURNING *;`,
        [userId]
      );
      expect(updatedUser).toEqual(mockUpdatedUser);
    });
  });
});
