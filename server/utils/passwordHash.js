const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const comparePassword = async (password, hash) => {
  try {
    bcrypt.compare(password, hash, (error, result) => {
      if (error) {
        throw error;
      }
      return result;
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

module.exports = { hashPassword, comparePassword };
