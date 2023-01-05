const router = require('express').Router();
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
	try {
		const allPosts = await Post.findAll({
			attributes: ['id', 'title', 'content', 'created'],
			include: [
				{
					model: Comment,
					attributes: ['id', 'text', 'user_id', 'post_id', 'created'],
					include: { model: User, attributes: ['username'] },
				},
				{ model: User, attributes: ['username'] },
			],
		});
		const postData = allPosts.map((post) => post.get({ plain: true }));

		res.render('dashboard', {
			postData,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/post/:id', async (req, res) => {
	try {
		const post = await Post.findOne({
			where: {
				id: req.params.id,
			},
			attributes: ['id', 'title', 'content', 'created'],
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

		const postData = post.get({ plain: true });

		res.render('post', {
			...postData,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/login', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/');
		return;
	}

	res.render('login');
});

router.get('/signup', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/');
		return;
	}

	res.render('signup');
});

module.exports = router;
