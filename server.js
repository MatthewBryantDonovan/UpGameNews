// Require packages
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Port to be used
var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/upGameNewsDB", {
  useNewUrlParser: true
});

// Routes
app.get("/del", function (req, res) {
  db.Article.deleteMany({}).then(function (data) {

  }).catch(function (err) {
    console.log(err);

  })
  res.send("del");
});

// A GET route for scraping the gamespot website
app.get("/scrape", function (req, res) {

  // Grab body of the gamespot html
  axios.get("https://www.gamespot.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    // Grab media articles
    $("article.media").each(function (i, element) {
      var result = {};

      result.title = $(this)
        .find(".media-title")
        .text();
      result.summary = $(this)
        .find(".media-deck")
        .text();
      result.link = $(this)
        .find(".js-click-tag")
        .attr("href");
      result.img = $(this)
        .find(".media-img img")
        .attr("src");

      // See if article exists already
      db.Article.findOne({
        title: result.title
      }).then(function (data) {
        if (!data) {
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function (dbArticle) {
              console.log("Article Added");
            })
            .catch(function (err) {
              console.log(err);
            });
        } else {
          console.log("Article already exists");
        }
      }).catch(function (err) {
        console.log(err);
      })
    });
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  db.Article.find({}).
  then(function (data) {

    res.json(data);
  }).catch(function (err) {
    console.log(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({
    _id: req.params.id
  }).
  populate("note").
  then(function (data) {

    res.json(data);
  }).catch(function (err) {
    console.log(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id/:note", function (req, res) {

    // If the Note doesn't exists - make a new one :: if it does - update it
    if (req.params.note == -1) {
      db.Note.create(req.body).then(function (data) {

        db.Article.findOneAndUpdate({
          _id: req.params.id
        }, {
          $push: {
            note: data._id
          }
        }, {
          new: true
        }).
        then(function (data) {

          res.json(data);
        }).catch(function (err) {
          console.log(err);
        })
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      db.Note.findOneAndUpdate({
        _id: req.params.note
      }, {
        title: req.body.title,
        body: req.body.body
      }).then(function (data) {
        console.log(data);
      }).catch(function (err) {
        console.log(err);
      });
    }
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/scrape");
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/articles");
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/articles/5e4c3cbb4eca4c27e8fdd60a");
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/");
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/del");
});