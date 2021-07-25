const bcrypt = require("bcrypt");
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await User.findByPk(req.session.user_id, {
            attributes: {exclude: ['password']},
            include: [
                
                {
                    model: Post,
                },
                {
                    model: Comment,
                }
            ],
        });

        const post = postData.get({ plain: true });

        // Pass serialized data and session flag into template (must be logged in)
        // res.render('post', {
        //     ...post,
        //     logged_in: req.session.logged_in
        // });

        // Output for postman testing
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    };
});


router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    };
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                username: req.body.username, 
            }, 
        });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password, please try again'});
            return;
        }

        console.log('Password is valid');

        req.session.save( () => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json( { user: userData, message: 'You are logged in!'});
        });

    } catch (err) {
        res.status(400).json(err);
    };
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy( () => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;