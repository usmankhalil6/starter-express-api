const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("TOKEN ERROR...", err);
    res.status(400).send("Invalid Token");
  }
};
