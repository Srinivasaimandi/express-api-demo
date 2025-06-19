/**
 * @author: srinivasaimandi
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by name or email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to search for
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email to search for
 *     responses:
 *       200:
 *         description: List of matching users
 */
router.get('/search', userController.searchUsers);

/**
 * @swagger
 * /users/count:
 *   get:
 *     summary: Get user count
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Number of users
 */
router.get('/count', userController.getUserCount);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - username
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input or duplicate user
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users/bulk:
 *   post:
 *     summary: Bulk add users
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - email
 *                 - username
 *                 - password
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *     responses:
 *       201:
 *         description: Users created
 *       400:
 *         description: Invalid input or duplicate user
 */
router.post('/bulk', userController.bulkAddUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;