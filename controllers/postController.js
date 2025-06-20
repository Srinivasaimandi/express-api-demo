/**
 * @author: srinivasaimandi
 */

const data = require('../data.json');
const Post = require('../models/post');

exports.getAllPosts = (req, res) => {
  res.json(data.posts);
};

exports.getPostsByUser = (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const posts = data.posts.filter(post => post.userId === userId);
  res.json(posts);
};

exports.getPostByUser = (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const postId = parseInt(req.params.postId, 10);
  const post = data.posts.find(post => post.userId === userId && post.id === postId);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found for this user' });
  }
};

exports.createPost = (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { title, content } = req.body;
  const newPost = new Post({
    id: data.posts.length + 1,
    userId,
    title,
    content
  });
  data.posts.push(newPost);
  res.status(201).json(newPost);
};

