// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
// =============================================================
module.exports = function (app) {
    // Routes

    app.get("/", function (req, res) {
        res.render("index", {});
    })

    app.get("/del", function (req, res) {
        db.Article.deleteMany({}).then(function (data) {
            db.SavedArticle.deleteMany({}).then(function (data) {
                res.send("del");
            }).catch(function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            console.log(err);
        });
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

    // Route for getting all Saved Articles from the db
    app.get("/articles/saved", function (req, res) {
        db.SavedArticle.find({}).
        then(function (data) {

            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Route for Saving Articles
    app.get("/articles/save/:id", function (req, res) {
        db.Article.findOne({
            _id: req.params.id
        }).
        then(function (data) {
            var newData = {
                title: data.title,
                summary: data.summary,
                link: data.link,
                img: data.img,
                note: data.note
            }
            db.SavedArticle.findOne({title: newData.title}).
            then(function (data) {
                
                if (data) {
                    res.json(data);
                } else {

                    db.SavedArticle.create(newData)
                        .then(function (dbArticle) {
                            console.log("Article Saved");
                            res.json(data);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            }).catch(function (err) {
                console.log(err);
            });

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

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/saved/:id", function (req, res) {
        db.SavedArticle.findOne({
            _id: req.params.id
        }).
        populate("note").
        then(function (data) {

            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Route for deleting a specific Article by id
    app.delete("/articles/:id", function (req, res) {
        db.Article.remove({
            _id: req.params.id
        }).
        then(function (data) {

            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Route for deleting a specific SavedArticle by id
    app.delete("/articles/saved/:id", function (req, res) {
        db.SavedArticle.remove({
            _id: req.params.id
        }).
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

    // Route to delete note
    app.delete("/articles/:id/:note", function (req, res) {
        db.Article.update({
            $pull: {
                note: req.params.note
            }
        }).then(function (data) {

            db.Note.remove({
                _id: req.params.note
            }).then(function (data) {
                res.json(data);
            }).catch(function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            console.log(err);
        });
    });

    app.get("*", function (req, res) {
        res.render("index", {});
    })

}