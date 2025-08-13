const bcrypt = require("bcrypt");

const verifyPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = verifyPassword;
