const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash")
let posts = [];

const homeStartingContent = "Welcome to our blog, a virtual canvas where curiosity takes the lead. Immerse yourself in a realm of captivating narratives, insightful explorations, and thought-provoking discussions. With each post, we embark on a quest to unravel mysteries, celebrate creativity, and deepen our understanding of the world around us.From the mesmerizing dance of distant galaxies to the rich tapestry of human history, our blog is a gateway to endless inspiration. Join us as we navigate the realms of science, art, culture, and beyond. As you embark on this journey, let your imagination roam free and your intellect flourish.Here, we invite you to not only be a reader but an active participant. Engage in conversations, share your thoughts, and let your curiosity guide you. Together, we'll embark on an exhilarating expedition of knowledge and discovery. Welcome to our blog, where the extraordinary awaits your exploration.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home.ejs", { startingContent: homeStartingContent, postsArray: posts });
})

app.get("/about", function (req, res) {
  res.render("about.ejs");
})

app.get("/contact", function (req, res) {
  res.render("contact.ejs");
})

app.get("/compose", function (req, res) {
  res.render("compose.ejs");
})

app.get("/posts/:postName", function (req, res) {

  var requestedTitle = lodash.lowerCase(req.params.postName);

  posts.forEach(function (post) {
    const storedTitle = lodash.lowerCase(post.title);
    if (storedTitle === requestedTitle) {
      console.log("Mathc Found");
      res.render("post.ejs", { postTitle: post.title, postBody: post.content })
    }
  })
})

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  }
  posts.push(post);
  res.redirect("/");
})


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
