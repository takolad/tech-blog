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
          model: Comment,
          where: {
            blog_id: req.params.id,
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

    const blog = blogData.get({ plain: true });
    // Send over the 'loggedIn' session variable to the 'blog' template
    res.render('blog', { blog, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET blogs by user_id
router.get('/dashboard/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      const blogData = await Blog.findByPk(req.session.user_id, {
        include: [
          {
            model: Comment,
            attributes: [
              'id',
              'content',
              'date',
              'user_id',
            ],
          },
        ],
      });

      const blog = blogData.get({ plain: true });
      // Send over the 'loggedIn' session variable to the 'blog' template
      res.render('homepage', { blog, loggedIn: req.session.loggedIn });
    }


  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one comment
router.get('/comment/:id', async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id);

    const comment = commentData.get({ plain: true });
    // Send over the 'loggedIn' session variable to the 'homepage' template
    res.render('comment', { comment, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
