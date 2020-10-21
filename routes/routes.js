//initialize express router
const blogPostController = require('../blogPostController');
let router = require('express').Router();

// set default API response
router.get('/', function (req, res) {
  res.json({
    status: 'API Works',
    message: 'Welcome to myBlog API'
  });
});

router.route('/post').get(blogPostController.index).post(blogPostController.add);
router
  .route('/posts/:id')
  .get(blogPostController.view)
  .patch(blogPostController.update)
  .put(blogPostController.update)
  .delete(blogPostController.delete);
//Export API routes
module.exports = router;
