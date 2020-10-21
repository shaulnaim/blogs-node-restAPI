const mongoose = require('mongoose');
//schema
let blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Export BlogPost Model
const BlogPost = mongoose.model('blogPost', blogPostSchema);
module.exports = BlogPost;
module.exports.get = function (callback, limit) {
  BlogPost.find(callback).limit(limit);
};
