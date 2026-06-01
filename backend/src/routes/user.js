const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const multer = require('multer');
const path = require('path');

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

router.post('/upload-avatar', upload.single('file'), userController.uploadAvatar);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', express.json(), userController.createUser);
router.put('/:id', express.json(), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;