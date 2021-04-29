const router = require('express').Router();
const { User, Comment, Blog } = require('../models');
const withAuth = require('../utils/auth');

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
              ],
            },
          ],
        });
  
        const blog = blogData.get({ plain: true });
        // Send over the 'loggedIn' session variable to the 'blog' template
        res.render('homepage', { blog, loggedIn: req.session.loggedIn });
      }
      else { res.render('/login')};
  
  
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });