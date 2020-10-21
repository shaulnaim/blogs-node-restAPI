//Import BlogPost Model
BlogPost = require('./blogPostModel');

//For index
exports.index = (req, res) => {
  BlogPost.get((err, blogPost) => {
    if (err)
      res.json({
        status: 'error',
        message: err
      });
    res.json({
      status: 'success',
      message: 'Got BlogPost Successfully!',
      data: blogPost
    });
  });
};

//For creating new blogPost
exports.add = (req, res) => {
  console.log(req.body);
  let blogPost = new BlogPost();
  blogPost.title = req.body.title;
  blogPost.content = req.body.content;
  //Save and check error
  blogPost.save((err) => {
    if (err) res.json(err);
    res.json({
      message: 'New BlogPost Added!',
      data: blogPost
    });
  });
};

// View BlogPost
exports.view = (req, res) => {
  BlogPost.findById(req.params.id, (err, blogPost) => {
    if (err) res.send(err);
    res.json({
      message: 'BlogPost Details',
      data: blogPost
    });
  });
};

// Update BlogPost
exports.update = (req, res) => {
  BlogPost.findById(req.params.id, (err, blogPost) => {
    if (err) res.send(err);
    // blogPost.id = req.body.id;
    blogPost.title = req.body.title;
    blogPost.content = req.body.content;
    //save and check errors
    blogPost.save((err) => {
      if (err) res.json(err);
      res.json({
        message: 'BlogPost Updated Successfully',
        data: blogPost
      });
    });
  });
};

// Delete BlogPost
exports.delete = (req, res) => {
  BlogPost.deleteOne(
    {
      _id: req.params.id
    },
    (err, contact) => {
      if (err) res.send(err);
      res.json({
        status: 'success',
        message: 'BlogPost Deleted'
      });
    }
  );
};
