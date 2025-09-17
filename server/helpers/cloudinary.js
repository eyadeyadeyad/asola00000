const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

async function imageUploadUtil(file) {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
  return {
    secure_url: `${baseUrl}/uploads/${file.filename}`,
    public_id: file.filename
  };
}

module.exports = { upload, imageUploadUtil };