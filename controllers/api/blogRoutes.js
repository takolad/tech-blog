const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update
router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatedBlog = await Blog.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!updatedBlog) {
      res.status(404).json({ message: 'No matching blog ID or you are not the original poster of this blog!' });
      return;
    }

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
