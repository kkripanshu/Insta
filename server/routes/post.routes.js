const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

const {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    likePost,
    commentOnPost,
    deleteComment,
    updatePost,
    getUserPosts
} = require('../controllers/post.controller');

const upload = multer({ storage: multer.memoryStorage() });

// Protected routes

router.post('/', authMiddleware, upload.single('media'), createPost);
router.delete('/:postId', authMiddleware, deletePost);
router.get('/', authMiddleware, getAllPosts);
router.get('/user/:userId', authMiddleware, getUserPosts);
router.get('/:postId', authMiddleware, getPostById);
router.post('/:postId/like', authMiddleware, likePost);
router.post('/:postId/comment', authMiddleware, commentOnPost);
router.delete('/:postId/comment/:commentId', authMiddleware, deleteComment);
router.put('/:postId', authMiddleware, upload.single('media'), updatePost);



// Post routes will be added here

module.exports = router;
