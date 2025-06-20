/**
 * @author: srinivasaimandi
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const postController = require('../controllers/postController');

/**
 * @swagger
 * /users/{userId}/posts:
 *   get:
 *     summary: Get all posts for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of posts for the user
 */
router.get('/', postController.getPostsByUser);

/**
 * @swagger
 * /users/{userId}/posts/{postId}:
 *   get:
 *     summary: Get a specific post for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: The post for the user
 *       404:
 *         description: Post not found
 */
router.get('/:postId', postController.getPostByUser);

/**
 * @swagger
 * /users/{userId}/posts:
 *   post:
 *     summary: Create a post for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/', postController.createPost);

module.exports = router;