// index.js

// Import express
const express = require('express');

// Import lodash
const _ = require('lodash');

// Import body parser
const bodyParser = require('body-parser');

//import mongoose
const mongoose = require('mongoose');

let port = process.env.PORT || 8080;

// Initialize express
const app = express();

//connect to mongoose
const dbPath = 'mongodb://localhost/firstrest';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const mongo = mongoose.connect(dbPath, options);
mongo.then(
  () => {
    console.log('connected to mongoDB');
  },
  (error) => {
    console.log(error, 'error');
  }
);

//Import routes
let apiRoutes = require('./routes');
//Use API routes in the App
app.use('/api', apiRoutes);

// Import express validator
const { body, validationResult } = require('express-validator');

// configure bodyparser to hande the post requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Use the body parser middleware to allow
// express to recognize JSON requests
app.use(bodyParser.json());

// Error handler
const createError = (message) => {
  return {
    errors: [
      {
        message
      }
    ]
  };
};

// auto generate uniqu id
const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 16);
};

// Post Array
let posts = [];

// Endpoint to check if API is working
app.get('/', (req, res) => {
  res.send({
    status: 'online'
  });
});

// Endpoint to create post
app.post(
  '/api/posts/',
  // Express validator middleware function to identify which
  // fields to validate
  [body('title').isString(), body('content').isString()],
  (req, res) => {
    // Retrieve errors from function
    const errors = validationResult(req);

    // If there are errors in validation, return the array of
    // error messages with the status of 422 Unprocessable
    // Entity
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Retrieve variables from the request body
    const { title, content } = req.body;

    // Generate a random ID for the post
    const id = generateId();

    const post = {
      id,
      title,
      content
    };

    // Add the post to the list of posts
    posts.push(post);

    // Return the post with 201 status code which will
    // signify the successful creation of the post
    res.status(201).send(post);
  }
);

// Endpoint to list all the posts
app.get('/api/posts/', (req, res) => {
  // Return the list of posts in reverse with the
  // status code 200 to signify successful retrieval

  res.send(posts.reverse());
});

// Endpoint to retrieve a post by its id
app.get('/api/posts/:id', (req, res) => {
  // Store id in variable from the path parameter
  const id = req.params.id;

  // Match the post using lodash's find function id and return
  // its contents
  const post = _.find(posts, (post) => post.id === id);

  // Handle error and return 400 Bad Request if post is not
  // found
  if (!post) {
    return res.status(400).send(createError('Post not found'));
  }

  // Return the post with the status code 200
  // to signify successful retrieval
  res.send(post);
});

// Endpoint update post by its id
app.put(
  '/api/posts/:id',
  // Express validator middleware function to identify which
  // fields to validate
  [body('title').isString(), body('content').isString()],
  (req, res) => {
    // Retrieve errors from function
    const errors = validationResult(req);

    // If there are errors in validation, return the array of
    // error messages with the status of 422 Unprocessable
    // Entity
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Store id in variable from the path parameter
    const id = req.params.id;

    // Retrieve variables from the request body
    const { title, content } = req.body;

    const updatedPost = {
      id,
      title,
      content
    };

    // Retrieve the index of the post using its id
    const index = _.findIndex(posts, (post) => post.id === updatedPost.id);

    // Handle error and return 400 Bad Request if index is -1
    // meaning the post is not found
    if (index === -1) {
      return res.status(400).send(createError('Post not found'));
    }

    // Replace the stored post with the updated one
    posts[index] = updatedPost;

    // Return the post with the status code 200
    // to signify successful update
    res.send(updatedPost);
  }
);

// Endpoint to delete post by its id
app.delete('/api/posts/:id', (req, res) => {
  // Store id in variable from the path parameter
  const id = req.params.id;

  // Retrieve the index of the post using its id
  const index = _.findIndex(posts, (post) => post.id === id);

  // Handle error and return 400 Bad Request if index is -1
  // meaning the post is not found
  if (index === -1) {
    return res.status(400).send(createError('Post not found'));
  }

  // Remove the post from the list of posts
  posts = posts.splice(index, 1);

  // Return the post with the status code 200
  // to signify successful deletion
  res.send({
    message: `Post with id ${id} has been successfully deleted`
  });
});

// Return an error if route does not exist in our server
app.all('*', (req, res) => {
  return res.status(404).send(createError('Not found'));
});

// Expose endpoints to port 3000
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
