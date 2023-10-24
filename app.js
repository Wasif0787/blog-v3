const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

// let posts = [];

const homeStartingContent =
  "Welcome to our blog, a virtual canvas where curiosity takes the lead. Immerse yourself in a realm of captivating narratives, insightful explorations, and thought-provoking discussions. With each post, we embark on a quest to unravel mysteries, celebrate creativity, and deepen our understanding of the world around us.From the mesmerizing dance of distant galaxies to the rich tapestry of human history, our blog is a gateway to endless inspiration. Join us as we navigate the realms of science, art, culture, and beyond. As you embark on this journey, let your imagination roam free and your intellect flourish.Here, we invite you to not only be a reader but an active participant. Engage in conversations, share your thoughts, and let your curiosity guide you. Together, we'll embark on an exhilarating expedition of knowledge and discovery. Welcome to our blog, where the extraordinary awaits your exploration.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const password = encodeURIComponent("#Wasif#blogv2786#");
mongoose
  .connect(
    `mongodb+srv://wasifhussain787:${password}@blogv2.dae83ee.mongodb.net/blogDB`
  )
  .then(() => {
    console.log("Connected successfylly");
  });

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String, // Add a field for the author's name
  comments: [
    {
      text: String,
      author: String, // Add a field for the comment author's name
      timestamp: Date,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find().then((foundPost) => {
    res.render("home.ejs", {
      startingContent: homeStartingContent,
      postsArray: foundPost,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about.ejs");
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs");
});

app.get("/compose", function (req, res) {
  res.render("compose.ejs");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }).then((foundPost) => {
    res.render("post", {
      postID: requestedPostId,
      postTitle: foundPost.title,
      postBody: foundPost.content,
      postUser: foundPost.author, // Change to foundPost.author
      comments: foundPost.comments,
    });
  });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    author: req.body.postBy,
  });
  post.save().then(() => {
    res.redirect("/");
  });
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // }
  // posts.push(post);
  // res.redirect("/");
});

app.post("/posts/:postId/comments", function (req, res) {
  const postId = req.params.postId;
  const commentAuthor = req.body.commentAuthor; // Get the comment author's name from the form
  const commentText = req.body.comment;

  // Find the post by ID and update its comments using Promises
  Post.findOne({ _id: postId })
    .then((foundPost) => {
      if (!foundPost) {
        return res.status(404).send("Post not found");
      }

      const newComment = {
        text: commentText,
        author: commentAuthor, // Add the author's name to the comment
        timestamp: new Date(),
      };

      foundPost.comments.push(newComment);
      return foundPost.save();
    })
    .then(() => {
      res.redirect("/posts/" + postId);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});
