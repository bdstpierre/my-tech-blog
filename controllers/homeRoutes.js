const router = require('express').Router();
const {Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        // Get all of the blog posts and author info
        const postData = await Post.findAll({
            include: [
                {
                    model: User, as: 'author',
                    attributes: ['username'],
                },
            ],
        });

        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));
        console.dir(posts);
        console.log(req.session.logged_in);

        // Pass serialized data and session flag into template (don't need to be logged in for homepage)
        res.render('homepage', {
            posts: {...posts},
            logged_in: req.session.logged_in            
        });

        // Output for postman testing
        // res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User, as: 'author',
                    attributes: {exclude: ['password']},
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User, as: 'commenter',
                            attributes: ['username'],
                        },
                    ],
                },
            ],
        });

        const post = postData.get({ plain: true });
        console.dir(post);

        // Pass serialized data and session flag into template (must be logged in)
        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });

        // Output for postman testing
        // res.status(200).json(post);

    } catch (err) {
        res.status(500).json(err);
    };
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        console.log(`user_id = ${req.session.user_id}`);
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password']},
            include: [{ model: Post}],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: req.session.logged_in
        });

        // Output for postman testing
        // res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    };
});

router.get('/new-post', withAuth, async (req, res) => {
    try {
        // console.log(`user_id = ${req.session.user_id}`);
        // // Find the logged in user based on the session ID
        // const userData = await User.findByPk(req.session.user_id, {
        //     attributes: { exclude: ['password']},
        //     include: [{ model: Post}],
        // });

        // const user = userData.get({ plain: true });

        res.render('new-post', {
            logged_in: req.session.logged_in
        });

        // Output for postman testing
        // res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    };
});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

module.exports = router;