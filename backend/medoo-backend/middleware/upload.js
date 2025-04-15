// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads/videos tồn tại
const videoDir = './uploads/videos';
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Nếu file là video, lưu vào thư mục uploads/videos
    if (file.mimetype.startsWith('video/')) {
      cb(null, videoDir);
    } else {
      // Nếu cần upload các loại file khác, có thể điều chỉnh ở đây
      cb(null, './uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file có mimetype bắt đầu bằng video/
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file video.'), false);
    }
  }
});

module.exports = upload;
