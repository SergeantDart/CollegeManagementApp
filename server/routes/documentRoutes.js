const Document = require("../models/Document");
const User = require("../models/User");


module.exports = function(app) {

    
    app.post("/api/sendDocument", (req, res) => {
        Document.create({
            documentTitle: req.body.documentTitle,
            documentDescription: req.body.documentDescription,
            documentStoragePath: req.body.documentStoragePath,
            userId: req.body.userId
        }).then(doc => {
            res.json(doc);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });

    app.get("/api/getDocuments", (req, res) => {
        Document.findAll({include : [
            {
                model: User
            }], offset: parseInt(req.query.offset), limit: parseInt(req.query.limit)})
        .then(docs => {
            if(docs) {
                res.json(docs);
            }else {
                res.json({
                    message: "No documents found..."
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    });


    app.get("/api/getDocument/:id", (req, res) => {
        Document.findByPk(req.params.id)
        .then(doc => {
            if(doc) {
                res.json(doc);
            }else {
                res.json({
                    message: "No document found"
                });
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            })
        })
    });

    app.delete("/api/deleteDocument/:id", (req, res) => {
        Document.findByPk(req.params.id)
        .then(doc => {
            if(doc) {
                doc.destroy()
                .then(doc => {
                    res.json(doc);
                }).catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    });
                })
            }
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });      
        })
    })
                  
    app.get("/api/countDocuments", (req, res) => {
        Document.count()
        .then(documentsCount => {
            res.json(documentsCount);
        }).catch(error => {
            console.log(error);
            res.json({
                message: error.message
            });
        })
    })
}