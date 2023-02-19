//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://" + process.env.USER_NAME + ":" + process.env.PASSWORD + "@cluster0.kxmtd.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "Whether you just want to share updates with your family and friends or you want to start a blog and build a broader audience, yourBlog has got you covered.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let defaultPosts = [{
  title: "T1",
  content: "C1"
}, {
  title: "T2",
  content: "C2"
}];
let posts = [];

app.get("/", function(req, res) {
  // Post.find({}).then((err, foundPosts) => {
  //console.log(foundPosts);
  //   if (!err) {
  //     if (foundPosts.length === 0) {
  //       Post.insertMany(defaultPosts, (err) => {
  //         (err) ? console.log(err): console.log("Succesfully saved default posts to DB.")
  //       });
  //       foundPosts = defaultPosts;
  //     }
  //     posts.push(foundPosts);
  //     res.render("home", {
  //       startingContent: homeStartingContent,
  //       posts: foundPosts
  //     });
  //   } else {
  //     console.log(foundPosts);
  //     res.render("home", {
  //       startingContent: homeStartingContent,
  //       posts: err
  //     });
  //   }
  //
  // });
  Post.find({}, function(err, foundPosts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPosts
      });
    }
  });

});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //posts.push(post);
  post.save(err => {
    if (!err) {
      res.redirect("/");
    }
  });
  console.log(post);



});

app.get("/posts/:postId", function(req, res) {

  const requestedId = (req.params.postId);
  Post.findById(requestedId, (err, post) => {
    if (!err) {
      if (!post) {
        console.log("Post invalid");
      } else {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    } else {
      console.log(err);
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
