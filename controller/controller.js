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

    // A GET route for scraping the gamespot website
    app.get("/", function (req, res) {

        // Grab body of the gamespot html
        axios.get("https://www.gamespot.com/").then(function (response) {
            var $ = cheerio.load(response.data);
            var n = 1;

            // Grab media articles ** this selector needs changed in 4 places if new scraping classes
            $("div.horizontal-card-item").each(function (i, element) {
                
                var result = {};

                result.title = $(this)
                    .find(".horizontal-card-item__title")
                    .text();
                result.summary = $(this)
                    .find(".horizontal-card-item__title")
                    .text();
                result.link = $(this)
                    .find(".horizontal-card-item__link ")
                    .attr("href");
                result.img = $(this)
                    .find(".horizontal-card-item__img img")
                    .attr("src");

                // See if article exists already
                db.Article.findOne({
                    title: result.title,
                    summary: result.summary
                }).then(function (data) {
                    if (!data) {
                        db.SavedArticle.findOne({
                            title: result.title,
                            summary: result.summary
                        }).then(function (data) {
                            if (!data) {
                                // Create a new Article using the `result` object built from scraping
                                db.Article.create(result)
                                    .then(function (dbArticle) {
                                        console.log("Article Added");
                                        console.log(dbArticle);
                                        if (n == $("div.horizontal-card-item").length) {
                                            db.Article.find({}).sort({date: -1}).
                                            then(function (data) {
                                                var hbsObj = {
                                                    urlAddr: "Current",
                                                    saved: false,
                                                    article: data
                                                }
                                                res.render("index", hbsObj);
                                            }).catch(function (err) {
                                                console.log(err);
                                            });
                                        } else {
                                            n++;
                                        }
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });

                            } else {
                                result.note = data.note;
                                // Create a new Article using the `result` object built from scraping
                                db.Article.create(result)
                                    .then(function (dbArticle) {
                                        console.log("Article Added and notes from saved fused!");
                                        if (n == $("div.horizontal-card-item").length) {
                                            db.Article.find({}).sort({date: -1}).
                                            then(function (data) {
                                                var hbsObj = {
                                                    urlAddr: "Current",
                                                    saved: false,
                                                    article: data
                                                }
                                                res.render("index", hbsObj);
                                            }).catch(function (err) {
                                                console.log(err);
                                            });
                                        } else {
                                            n++;
                                        }
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            }
                        }).catch(function (err) {
                            console.log(err);
                        })
                    } else {
                        console.log("Article already exists in currents");
                        if (n == $("div.horizontal-card-item").length) {
                            db.Article.find({}).sort({date: -1}).
                            then(function (data) {
                                var hbsObj = {
                                    urlAddr: "Current",
                                    saved: false,
                                    article: data
                                }
                                res.render("index", hbsObj);
                            }).catch(function (err) {
                                console.log(err);
                            });
                        } else {
                            n++;
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                })
            });
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        db.Article.find({}).sort({date: -1}).
        then(function (data) {
            var hbsObj = {
                urlAddr: "Current",
                saved: false,
                article: data
            }
            res.render("index", hbsObj);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Route for getting all Saved Articles from the db
    app.get("/articles/saved", function (req, res) {
        db.SavedArticle.find({}).sort({date: -1}).
        then(function (data) {
            var hbsObj = {
                urlAddr: "Saved",
                saved: true,
                article: data
            }
            res.render("index", hbsObj);
        }).catch(function (err) {
            console.log(err);
        });
    });

    app.get("/delete/all", function (req, res) {
        db.Article.deleteMany({}).then(function (data) {
            res.render("index", {urlAddr: "Deleted All"});
        }).catch(function (err) {
            console.log(err);
        });
    });


    // Route for Saving Articles
    app.get("/api/articles/save/:id", function (req, res) {
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
            db.SavedArticle.findOne({
                title: newData.title
            }).
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
    app.get("/api/articles/:id", function (req, res) {
        console.log(req.params.id);

        db.Article.findOne({
            _id: req.params.id
        }).
        populate("note").
        then(function (data) {
            console.log(data);
            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Route for grabbing a specific Saved Article by id, populate it with it's note
    app.get("/api/articles/saved/:id", function (req, res) {
        console.log(req.params.id);
        db.SavedArticle.findOne({
            _id: req.params.id
        }).
        populate("note").
        then(function (data) {
            console.log(data);


            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Route for deleting a specific Article by id
    app.delete("/api/articles/:id", function (req, res) {
        db.Article.remove({
            _id: req.params.id
        }).
        then(function (data) {

            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Route for deleting a specific Saved Article by id
    app.delete("/api/articles/saved/:id", function (req, res) {
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
    app.post("/api/articles/:id/:note", function (req, res) {

        // If the Note doesn't exists - make a new one :: if it does - update it
        if (req.params.note == -1) {
            db.Note.create(req.body).then(function (data) {
                var newNote = data._id
                db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        note: newNote
                    }
                }, {
                    new: true
                }).
                then(function (data) {

                    db.SavedArticle.findOneAndUpdate({
                        title: data.title,
                        summary: data.summary
                    }, {
                        $push: {
                            note: newNote
                        }
                    }, {
                        new: true
                    }).
                    then(function (data) {
                        console.log(data.title);


                        res.json(data);
                    }).catch(function (err) {
                        console.log(err);
                    });
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

    // Route for saving/updating an SAVED Article's associated Note
    app.post("/api/articles/saved/:id/:note", function (req, res) {

        // If the Note doesn't exists - make a new one :: if it does - update it
        if (req.params.note == -1) {
            db.Note.create(req.body).then(function (data) {
                var newNote = data._id

                db.SavedArticle.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        note: newNote
                    }
                }, {
                    new: true
                }).
                then(function (data) {
                    db.Article.findOneAndUpdate({
                        title: data.title,
                        summary: data.summary
                    }, {
                        $push: {
                            note: newNote
                        }
                    }, {
                        new: true
                    }).
                    then(function (data) {
                        console.log(data.title);


                        res.json(data);
                    }).catch(function (err) {
                        console.log(err);
                    });
                }).catch(function (err) {
                    console.log(err);
                });
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
    app.delete("/api/articles/:id/:note", function (req, res) {
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
        res.redirect("/");
    })

}