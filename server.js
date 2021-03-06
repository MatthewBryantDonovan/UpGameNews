// Require packages
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


// Port to be used
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
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
// mongoose.connect("mongodb://localhost/upGameNewsDB", {
//   useNewUrlParser: true
// });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/upGameNewsDB";

mongoose.connect(MONGODB_URI);

// Import routes and give the server access to them.
require("./controller/controller.js")(app);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/articles/scraped");
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/api/articles");
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/");
  console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/delete/all");
});