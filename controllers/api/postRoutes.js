const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Gets all blog posts
router.get('/', async (req, res) => {
	try {
		const postData = await Post.findAll({
			attributes: ['id', 'title', 'content', 'created'],
			order: [['created_at', 'DESC']],
			include: [
				{
					model: User,
					attributes: ['username'],
				},
				{
					model: Comment,
					attributes: ['id', 'text', 'created', 'user_id', 'post_id'],
					include: { model: User, attributes: ['username'] },
				},
			],
		});
		res.status(200).json(postData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Gets blog post matching passed ID
router.get('/:id', async (req, res) => {
	try {
		const posts = await Post.findOne({
			where: {
				id: req.params.id,
			},
			attributes: ['id', 'title', 'content', 'created'],
			include: [
				{ model: User, attributes: ['username'] },
				{
					model: Comment,
					attributes: ['id', 'text', 'post_id', 'user_id', 'created'],
					include: { model: User, attributes: ['username'] },
				},
			],
		});
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Creates new blog post
router.post('/', withAuth, async (req, res) => {
	try {
		const newPost = await Post.create({
			title: req.body.title,
			content: req.body.content,
			user_id: req.session.user_id,
		});

		res.status(200).json(newPost);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Edits existing blog post matching passed ID
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.update(
			{ title: req.body.title, content: req.body.content },
			{
				where: {
					id: req.params.id,
				},
			}
		);
		res.status(200).json(post);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Deletes blog post matching passed ID
router.delete('/:id', withAuth, async (req, res) => {
	try {
		const post = await Post.destroy({
			where: {
				id: req.params.id,
				user_id: req.session.user_id,
			},
		});

		if (!post) {
			res
				.status(404)
				.json({ message: 'No blog post found matching provided id!' });
			return;
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
