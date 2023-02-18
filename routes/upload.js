const express = require("express");
const router = express.Router();
const verifyToken = require("../function/verifyToken");

// controllers
const { upload, remove } = require("../cloudinary");

router.post("/upload", verifyToken, upload);
router.post("/removeimage", verifyToken, remove);

module.exports = router;
