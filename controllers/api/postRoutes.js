const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);

        const post = postData.get({ plain: true });
        console.dir(post);

        // Pass serialized data and session flag into template (must be logged in)
        res.render('edit-post', {
            post,
            logged_in: req.session.logged_in
        });

        // Output for postman testing
        // res.status(200).json(post);

    } catch (err) {
        res.status(500).json(err);
    };
});

router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);

    } catch (err) {
        res.status(400).json(err);
    };
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedPost = await Post.update({
            ...req.body
        },
        {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
    });

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(500).json(err);
    };

});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!'});
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;