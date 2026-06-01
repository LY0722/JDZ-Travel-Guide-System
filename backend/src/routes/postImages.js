const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postImagesController = require('../controllers/postImages');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), postImagesController.uploadPostImage);
router.get('/', postImagesController.getImagesByPost);

module.exports = router;