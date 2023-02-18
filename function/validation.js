const validator = require("validator");

const registerValidator = ({ email = "", password = "" }) => {
  if (!validator.isEmail(email)) {
    return { error: true, message: "Invalide Email" };
  }
  if (!validator.isLength(password, { min: 8 })) {
    return { error: true, message: "password length should be greate then 7" };
  }
  return { error: false, message: "" };
};

module.exports.registerValidator = registerValidator;
