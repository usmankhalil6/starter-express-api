const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { registerValidator } = require("../function/validation");
const { uidGenerator } = require("../function/uidGenerator");
// Load configuration from .env file
require("dotenv").config();
const messagebird = require("messagebird")(process.env.MESSAGEBIRD_API_KEY);
// //
// router.post("/user/register", async (req, res) => {
//   const { error, message } = registerValidator(req.body);
//   if (error) {
//     return res.status(400).json({ message });
//   }
//   const phoneExsist = await User.findOne({ phone: req.body.phone });
//   if (phoneExsist) {
//     return res.status(400).json({ message: "phone already exsist" });
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashPass = await bcrypt.hash(req.body.password, salt);
//     const user = new User({
//       ...req.body,
//       password: hashPass,
//       uid: uidGenerator(5),
//     });
//     await user.save();

//     const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
//     res.header("accessToken", token).send({ accessToken: token, user });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// router.post("/user/login", async (req, res) => {
//   const { error, message } = registerValidator(req.body);
//   if (error) {
//     return res.status(400).send(message);
//   }
//   const user = await User.findOne({ phone: req.body.phone });
//   if (!user) {
//     return res.status(400).json({ message: "phone doesn't exsist" });
//   }
//   try {
//     const validPass = await bcrypt.compare(req.body.password, user.password);
//     if (!validPass) {
//       return res.status(400).json({ message: "Invalid Password" });
//     }
//     const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
//     res.header("accessToken", token).send({ accessToken: token, user });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

router.post("/user/phone", async (req, res) => {
  try {
    var phone = req.body.phone;
    if (!phone) {
      return res.status(400).send("Phone Number Is Required");
    }
    messagebird.verify.create(
      phone,
      {
        originator: "Brandshub",
        template: "Your verification code is %token.",
        timeout: 120,
      },
      function (err, response) {
        if (err) {
          return res
            .status(400)
            .send("Something Went Wrong While Send Message");
        } else {
          res.send("Message Send Successfully");
        }
      }
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/phone/verification", async (req, res) => {
  try {
    var id = req.body.id;
    var token = req.body.token;

    messagebird.verify.verify(id, token, function (err, response) {
      if (err) {
        return res.status(400).send("Something Went Wrong While Verifying");
      } else {
        res.send("User Verified");
        // Here we create or verify user
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/user/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["_id", "favourites"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(500).json({ message: "invalid user" });
  }

  try {
    const user = await User.findOne({
      _id: req.params.id,
    });

    if (!user) {
      return res.status(500).json({ message: "user not found" });
    }
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
