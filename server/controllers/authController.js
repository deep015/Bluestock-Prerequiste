
const admin = require('../config/firebaseAdmin');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mailer');


const jwtSecret = process.env.JWT_KEY || 'YOUR_SECRET_KEY';

exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, full_name, mobile_no, gender } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }
    
    const gender_char = gender ? gender.charAt(0).toUpperCase() : null;
    const password_hash = await bcrypt.hash(password, 10);

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: full_name,
    });
    
    const emailVerificationLink = await admin.auth().generateEmailVerificationLink(email);
    await mailer.sendEmail(
      email,
      'Email Verification',
      `Please verify your email by clicking on this link: ${emailVerificationLink}`
    );
    
    const newUser = await userModel.create({
      firebase_uid: userRecord.uid,
      email,
      password_hash,
      full_name,
      mobile_no,
      gender: gender_char,
      signup_type: 'e',
      is_email_verified: false,
      is_mobile_verified: false
    });

    res.status(201).json({
  message: 'User registered successfully. An email verification link has been sent to your inbox. Please also verify your mobile number.',
  userId: newUser.id,
  email: newUser.email
});

 
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const userRecord = await admin.auth().getUserByEmail(email);

    const localUser = await userModel.findByFirebaseUid(userRecord.uid);
    if (!localUser) {
      return res.status(404).json({ message: 'User not found in local database.' });
    }
    
    const token = jwt.sign(
      { id: localUser.id, email: localUser.email, firebaseUid: userRecord.uid },
      jwtSecret,
      { expiresIn: '90d' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
    });

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    next(error);
  }
};


exports.verifyEmail = async (req, res, next) => {
  try {
    const { oobCode } = req.query;

    if (!oobCode) {
      return res.status(400).json({ message: 'Missing verification code.' });
    }

    // Verify and apply the Firebase action code
    const info = await admin.auth().checkActionCode(oobCode);
    await admin.auth().applyActionCode(oobCode);

    // info.data.email contains the verified email
    const email = info.data.email;

    // Update in your database
    const user = await userModel.findOne({ where: { email } });
    if (user) {
      user.is_email_verified = true;
      await user.save();
    }

    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(400).json({ message: 'Invalid or expired email verification link.' });
  }
};

// ✅ Mobile verification
exports.verifyMobile = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID.' });
    }

    const user = await userModel.findByPk(userId);
    if (user) {
      user.is_mobile_verified = true;
      await user.save();
    }

    return res.status(200).json({ message: 'Mobile number verified successfully.' });
  } catch (error) {
    console.error('Mobile verification error:', error);
    return res.status(400).json({ message: 'Failed to verify mobile number.' });
  }
};