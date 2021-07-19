const News = require("../models/News");

module.exports = function(app) {

    app.post("/api/addNews", (req, res) => {
        News.create({
            newsAuthorName: req.body.newsAuthorName,
            newsTitle: req.body.newsTitle,
            newsPicturePath: req.body.newsPicturePath,
            newsText: req.body.newsText
        }).then(news => {
            res.json(news);
        }).catch(error => {
            res.json({
                message: error.message
            })
        });
    });


    app.get("/api/getNews", (req, res) => {
        News.findAll({order: [['updatedAt', 'DESC']], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(news => {
            if(news) {
                res.json(news);
            }else {
                res.json({
                    message: "No news found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });

    app.get("/api/getFilteredNews", (req, res) => {
        News.findAll({order: [['updatedAt', 'DESC']]})
        .then(news => {
            if(news) {
                news = news.filter(news => news.newsAuthorName.startsWith(req.query.keyword) || news.newsTitle.startsWith(req.query.keyword));
                res.json(news);
            }else {
                res.json({
                    message: "No news found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });


    app.get("/api/getNews/:id", (req, res) => {
        News.findByPk(req.params.id)
        .then(news => {
            if(news) {
                res.json(news);
            }else {
                res.json({
                    message: "No news found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })    
    });

    app.post("/api/updateNews/:id", (req, res) => {
        News.findByPk(req.params.id)
        .then(news => {
            if(news) {
                news.update(req.body)
                .then(news => {
                    res.json(news);
                }).catch(error => {
                    console.log(errror);
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: "No news found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })  
    })

    app.delete("/api/deleteNews/:id", (req, res) => {
        News.findByPk(req.params.id)
        .then(news => {
            if(news) {
                news.destroy()
                .then(news => {
                    res.json(news);
                }).catch(error => {
                    console.log(errror);
                    res.json({
                        message: error.message
                    });
                })
            }else {
                res.json({
                    message: "No news found"
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })  
    });

    app.get("/api/countNews", (req, res) => {
        News.count()
        .then(newsCount => {
            res.json(newsCount);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        });
    })
    
}