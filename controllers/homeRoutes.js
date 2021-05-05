const router = require('express').Router();
const { User, Comment, Blog } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        { model: Comment },
        {
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one blog
router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: [
            'username', 'id',
          ],
        },
        {
          model: Comment,
          where: {
            blog_id: req.params.id,
          },
          required: false,
          include: [
            {
              model: User,
              attributes: [
                'username'
              ],
            },
          ],
        },
      ],
    });


    const blog = blogData.get({ plain: true });

    res.render('blog', {
      blog,
      logged_in: req.session.logged_in,
      userID: req.session.user_id
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET user's blogs
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog}],
    });

    const user = userData.get({ plain: true });

    // Send over the 'logged_in' session variable to the 'user' template
    res.render('dashboard', { ...user, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one comment
router.get('/comment/:id', async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          exclude: [
            'password'
          ],
        },
        {
          model: Blog,
        },
      ],
    });

    const comment = commentData.get({ plain: true });
    // Send over the 'logged_in' session variable to the 'homepage' template
    res.render('comment', { ...comment, logged_in: req.session.logged_in, sess_user: req.session.user_id });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});

module.exports = router;
