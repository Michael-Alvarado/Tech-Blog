const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Gets all comments
router.get('/', async (req, res) => {
	try {
		const comments = await Comment.findAll({});
		res.status(200).json(comments);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Gets comment matching passed ID
router.get('/:id', async (req, res) => {
	try {
		const comment = await Comment.findAll({
			where: {
				id: req.params.id,
			},
		});
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Posts a new comment
router.post('/', withAuth, async (req, res) => {
	try {
		const newComment = await Comment.create({
			...req.body,
			user_id: req.session.user_id,
		});
		res.status(200).json(newComment);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Edits comment matching passed ID
router.put('/:id', withAuth, async (req, res) => {
	try {
		const comment = await Comment.update(
			{
				text: req.body.text,
			},
			{
				where: {
					id: req.params.id,
				},
			}
		);

		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Deletes Comment matching passed ID
router.delete('/:id', withAuth, async (req, res) => {
	try {
		const comment = await Comment.destroy({
			where: {
				id: req.params.id,
			},
		});

		if (!comment) {
			res
				.status(404)
				.json({ message: 'No Comment found matching provided ID!' });
			return;
		}

		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
