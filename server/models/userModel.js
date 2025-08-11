// File: /backend/src/models/userModel.js

const pool = require('../config/db');

exports.create = async (userData) => {
  const {
    firebase_uid,
    email,
    password_hash,
    full_name,
    mobile_no,
    gender,
    signup_type,
    is_email_verified,
    is_mobile_verified,
  } = userData;

  const result = await pool.query(
    `INSERT INTO users (
      firebase_uid,
      email,
      password_hash,
      full_name,
      mobile_no,
      gender,
      signup_type,
      is_email_verified,
      is_mobile_verified
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, email`,
    [
      firebase_uid,
      email,
      password_hash,
      full_name,
      mobile_no,
      gender,
      signup_type,
      is_email_verified,
      is_mobile_verified,
    ]
  );
  return result.rows[0];
};

exports.findByFirebaseUid = async (firebaseUid) => {
  const result = await pool.query(
    'SELECT id, email FROM users WHERE firebase_uid = $1',
    [firebaseUid]
  );
  return result.rows[0];
};

exports.findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, email FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

exports.updateEmailVerificationStatus = async (userId) => {
  await pool.query(
    'UPDATE users SET is_email_verified = true WHERE id = $1',
    [userId]
  );
};

exports.updateMobileVerificationStatus = async (userId) => {
  await pool.query(
    'UPDATE users SET is_mobile_verified = true WHERE id = $1',
    [userId]
  );
};
