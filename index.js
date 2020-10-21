const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/routes');
let port = process.env.PORT || 8080;

const app = express();

//configure bodyparser to handel the post requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// allow express to recognize JSON requests
app.use(bodyParser.json());

//connect to mongoose
const dbPath = 'mongodb://localhost/blogPosts';
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

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
