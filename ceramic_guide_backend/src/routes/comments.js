const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');

router.get('/', commentsController.getAllComments);
router.get('/:id', commentsController.getCommentById);
router.post('/', express.json(), commentsController.createComment);
router.delete('/:id', commentsController.deleteComment);
router.get('/user/:user_id', commentsController.getCommentsByUser);

module.exports = router;