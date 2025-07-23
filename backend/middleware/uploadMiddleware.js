const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store in /uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Accept images and videos only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|mp4|mov|webm/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
