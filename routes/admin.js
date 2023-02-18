const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");
const { registerValidator } = require("../function/validation");
// Load configuration from .env file
require("dotenv").config();
const messagebird = require("messagebird")(process.env.MESSAGEBIRD_API_KEY);
// //
router.post("/admin/register", async (req, res) => {
  const { error, message } = registerValidator(req.body);
  if (error) {
    return res.status(400).json({ message });
  }
  const emailExsist = await Admin.findOne({ email: req.body.email });
  if (emailExsist) {
    return res.status(400).json({ message: "Email already exsist" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const admin = new Admin({
      ...req.body,
      password: hashPass,
    });
    await admin.save();

    const token = jwt.sign({ _id: admin._id }, process.env.ADMIN_TOKEN_SECRET);
    res.header("accessToken", token).send({ accessToken: token, user: admin });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/admin/login", async (req, res) => {
  const { error, message } = registerValidator(req.body);
  if (error) {
    return res.status(400).send(message);
  }
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) {
    return res.status(400).json({ message: "email doesn't exsist" });
  }
  try {
    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ _id: admin._id }, process.env.ADMIN_TOKEN_SECRET);
    res.header("accessToken", token).send({ accessToken: token, user: admin });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
