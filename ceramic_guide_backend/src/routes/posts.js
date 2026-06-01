const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/', express.json(), postsController.createPost);
router.delete('/:id', postsController.deletePost);
router.put('/:id', express.json(), postsController.updatePost);
router.get('/user/:user_id', postsController.getPostsByUser);

module.exports = router;