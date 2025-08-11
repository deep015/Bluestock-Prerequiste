// File: /backend/src/controllers/authController.js
const { StatusCodes } = require("http-status-codes");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../utils/mailer"); // Import the mailer utility

// Placeholder function for sending SMS. You will need to implement this.
const sendVerificationSms = async (mobileNumber, token) => {
  // Use a service like Twilio to send an SMS with the token.
  console.log(`Sending SMS to ${mobileNumber} with token: ${token}`);
  // Your SMS sending logic here
};

exports.register = async (req, res) => {
  const { username, password, email, mobile_number } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to the database
    const newUser = await pool.query(
      `INSERT INTO users (username, password, email, mobile_number) VALUES ($1, $2, $3, $4) RETURNING id, username`,
      [username, hashedPassword, email, mobile_number]
    );

    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully. Please verify your email and mobile number.",
      userId: newUser.rows[0].id
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Email or username already exists." });
    }
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Registration failed." });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(StatusCodes.OK).json({
      msg: "Login successful.",
      token: token,
      userId: user.rows[0].id
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Login failed." });
  }
};

exports.sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await pool.query(
      "UPDATE users SET email_verification_token = $1 WHERE email = $2",
      [verificationToken, email]
    );

    // Use the mailer utility to send the email
    await mailer.sendEmail(
      email,
      'Email Verification',
      `Please verify your email by clicking on this link: http://localhost:3000/api/auth/verify-email?token=${verificationToken}`
    );

    res.status(StatusCodes.OK).json({ msg: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to send verification email." });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await pool.query(
      "SELECT * FROM users WHERE email_verification_token = $1",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid or expired token." });
    }

    await pool.query(
      "UPDATE users SET email_verified = true, email_verification_token = NULL WHERE id = $1",
      [user.rows[0].id]
    );

    res.status(StatusCodes.OK).json({ msg: "Email verified successfully." });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Email verification failed." });
  }
};

exports.sendMobileVerification = async (req, res) => {
  try {
    const { mobile_number } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE mobile_number = $1", [mobile_number]);
    if (user.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found." });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit number

    await pool.query(
      "UPDATE users SET mobile_verification_token = $1 WHERE mobile_number = $2",
      [verificationToken, mobile_number]
    );

    await sendVerificationSms(mobile_number, verificationToken);

    res.status(StatusCodes.OK).json({ msg: "Verification SMS sent. Please check your phone." });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to send verification SMS." });
  }
};

exports.verifyMobile = async (req, res) => {
  try {
    const { token, mobile_number } = req.body;
    const user = await pool.query(
      "SELECT * FROM users WHERE mobile_verification_token = $1 AND mobile_number = $2",
      [token, mobile_number]
    );

    if (user.rows.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid or expired token." });
    }

    await pool.query(
      "UPDATE users SET mobile_verified = true, mobile_verification_token = NULL WHERE id = $1",
      [user.rows[0].id]
    );

    res.status(StatusCodes.OK).json({ msg: "Mobile number verified successfully." });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Mobile verification failed." });
  }
};
