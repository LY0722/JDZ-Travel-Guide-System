const express = require('express');
const likesController = require('../controllers/likes'); // 修改这里
const router = express.Router();

router.get('/', likesController.getLikes);
router.post('/', express.json(), likesController.addLike);
router.delete('/', likesController.removeLike);
router.get('/user', likesController.getLikesByUser); // 正确写法

module.exports = router;