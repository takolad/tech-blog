const router = require('express').Router();
const { User, Comment, Blog } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: Comment,
          attributes: {
            exclude: ['id'],
          },
        },
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
            'username',
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
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET blogs by user_id
router.get('/dashboard', withAuth, async (req, res) => {
  try {
      const userData = await User.findbyPk(req.session.user_id, {
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Blog,
          },
          {
            model: Comment,
            attributes: {
              exclude: ['id'],
            },
            required: false,
          },
        ],
      });

      const user = userData.get({ plain: true });
      // Send over the 'logged_in' session variable to the 'blog' template
      res.render('dashboard', { ...user, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one comment
router.get('/comment/:id', async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id);

    const comment = commentData.get({ plain: true });
    // Send over the 'logged_in' session variable to the 'homepage' template
    res.render('comment', { ...comment, logged_in: req.session.logged_in });
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
