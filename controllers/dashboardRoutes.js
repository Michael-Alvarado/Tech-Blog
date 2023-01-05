const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
	try {
		const allPosts = await Post.findAll({
			where: {
				user_id: req.session.user_id,
			},
			attributes: ['id', 'title', 'content', 'created_at'],
			include: [
				{
					model: Comment,
					attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
					include: {
						model: User,
						attributes: ['username'],
					},
				},
				{
					model: User,
					attributes: ['username'],
				},
			],
		});
		const postData = allPosts.map((post) => post.get({ plain: true }));

		res.render('dashboard', { postData, loggedIn: true });
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/edit/:id', withAuth, async (req, res) => {
	try {
		const post = await Post.findOne({
			where: {
				id: req.params.id,
			},
			attributes: ['id', 'title', 'content', 'created_at'],
			include: [
				{
					model: User,
					attributes: ['username'],
				},
				{
					model: Comment,
					attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
					include: {
						model: User,
						attributes: ['username'],
					},
				},
			],
		});

		if (!post) {
			res.status(404).json({ message: 'No post found with provided id!' });
			return;
		}

		const postData = post.get({ plain: true });
		res.render('editpost', { postData, loggedIn: true });
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/newpost', (req, res) => {
	res.render('newpost', { loggedIn: true });
});

module.exports = router;
