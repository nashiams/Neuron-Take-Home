const bcrypt = require("bcrypt");

/**
 * Generate password from employee data
 * Format: FirstName + YYYYMMDD
 * Example: Ahmad20190115
 */
const generatePasswordFromEmployee = (name, joinDate) => {
  const firstName = name.split(" ")[0];

  const date = new Date(joinDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}${month}${day}`;

  return `${firstName}${formattedDate}`;
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  generatePasswordFromEmployee,
  hashPassword,
  comparePassword,
};
