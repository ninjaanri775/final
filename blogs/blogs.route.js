const express = require('express');
const isAuth = require('../middlewares/isAuth');
const upload = require('../config/cloudinary.config');
const {
  findAllBlogs,
  findBlogById,
  createBlog,
  deleteBlogById,
  updateBlogById,
} = require('./blogs.service');

const blogRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Retrieve a list of blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
blogRouter.get('/', findAllBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Blog ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The blog description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */
blogRouter.get('/:id', findBlogById);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
blogRouter.post('/', isAuth, upload.single('image'), createBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Blog ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
blogRouter.delete('/:id', isAuth, deleteBlogById);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Blog ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
blogRouter.put('/:id', isAuth, upload.single('image'), updateBlogById);

module.exports = blogRouter;
