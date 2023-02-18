const cloudinary = require("cloudinary");

// Load configuration from .env file
require("dotenv").config();
// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// req.files.file.path
exports.upload = async (req, res) => {
  try {
    cloudinary.uploader
      .upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: "image", // jpeg, png
      })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        console.log("ERROR...", err);
      });
  } catch (error) {
    console.log("ERROR....", error);
  }
};

exports.remove = (req, res) => {
  let image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send("ok");
  });
};
