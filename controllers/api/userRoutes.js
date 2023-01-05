const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// Gets all users
router.get('/', async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: { exclude: ['password'] },
		});
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Gets user matching passed ID
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findOne({
			attributes: { exclude: ['password'] },
			where: {
				id: req.params.id,
			},
			include: [
				{ model: Post, attributes: ['id', 'title', 'content', 'created'] },
				{
					model: Comment,
					attributes: ['id', 'text', 'created'],
					include: { model: Post, attributes: ['title'] },
				},
				{ model: Post, attributes: ['title'] },
			],
		});

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Creates a sequelize session with User data
router.post('/', async (req, res) => {
	try {
		const user = await User.create({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		});

		req.session.save(() => {
			req.session.user_id = user.id;
			req.session.username = user.username;
			req.session.logged_in = true;

			res.status(200).json(user);
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// Request to login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({
			where: { username: req.body.username },
		});

		if (!user) {
			res.status(400).json({ message: 'Incorrect Username or Password!' });
			return;
		}

		const validPassword = await user.checkPassword(req.body.password);

		if (!validPassword) {
			res.status(400).json({
				message: 'Incorrect Username or Password! ',
			});
			return;
		}

		req.session.save(() => {
			req.session.user_id = user.id;
			req.session.username = user.username;
			req.session.logged_in = true;

			res.json({ user: user, message: 'You are now logged in!' });
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// Logs out user and ends session
router.post('/logout', (req, res) => {
	if (req.session.logged_in) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

module.exports = router;
