/**
 * Created by MyPC on 31/12/2016.
 */
const Blog = require('../models/Blog');
const Category = require('../models/BlogCategory');
/**
 * Blog API
 */

exports.blogApi = (req, res) => {
    Blog.getBlogs(function (err, blogs) {
        if (err) {
            res.json({code: 400, message: "error", data: err})
        }
        else {
            res.json({
                code: 200, message: "ok", data: blogs
            })
        }
    });
};

exports.addBlog = (req, res) => {
    const title = req.body.title;
    const category = req.body.category
    const body = req.body.body
    const author = req.body.author;
    const tags = req.body.tags;
    const date = new Date();
    let mainImageName = ''
    if (req.file) {
        console.log(req.file)
        mainImageName = req.file.filename
    } else {
        console.log('error upload file')
        mainImageName = 'noimage.png';
    }

    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.json({code: 400, message: "error", data: err})
    } else {
        //submit to db
        const newBlog = new Blog({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "tags": tags,
            "author": author,
            "image": mainImageName
        });

        newBlog.save(function (err, post) {
            if (err) {
                res.json({code: 400, message: "error", data: err})
            } else {
                res.json({
                    code: 200, message: "ok", data: post
                })
            }
        })
    }
};
exports.getBlogById = (req, res) => {
    Blog.findById(req.params.id, (err, post) => {
        if (err) res.json({code: 400, message: "error", data: err});
        else     res.json({code: 200, message: "success", data: post})
    })
};

exports.addCommentToBlog = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const body = req.body.body;
    const postid = req.params.id;
    const commentDate = new Date();

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not formatted correctly').isEmail();
    req.checkBody('body', 'Body field is required').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
        Blog.findById(postid, (err, post) => {
            res.json({
                code: 400,
                message: errors,
                data: post
            });
        })
    } else {
        const comment = {
            "name": name,
            "email": email,
            "body": body,
            "commentdate": commentDate
        };
        Blog.update({
            '_id': postid
        }, {
            $push: {
                "comments": comment
            }
        }, function (err, doc) {
            if (err) {
                res.json({code: 400, message: err, data: doc})
            } else {
                res.json({code: 200, message: "new comment added successfully", data: comment})
            }
        })
    }
};

exports.addBlogCategory = (req, res) => {
//Get form value
    const title = req.body.title;
    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.json({
            code: 400,
            message: "error",
            data: errors
        });
    } else {
        //submit to db
        const newCat = new Category({"title": title})
        newCat.save(err => {
            if (err) {
                res.json({code: 400, message: "error", data: err})
            } else {
                res.json({code: 200, message: "success", data: newCat})
            }
        })
    }
};

exports.getCategory = (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) res.json({code: 400, message: "error", data: err});
        else res.json({code: 200, message: "success", data: categories})
    })
};
exports.getBlogByCategory = (req, res) => {
    Blog.find(req.params.category, (err, blogs) => {
        if (err) res.json({code: 400, message: "error", data: err});
        else res.json({code: 200, message: "success", data: blogs})
    })
};

exports.editBlog = (req, res) => {
    const title = req.body.title && req.body.title.trim();
    const category = req.body.category && req.body.category.trim();
    const body = req.body.body && req.body.body.trim();
    const tags = req.body.tags && req.body.tags.trim();
    const date = req.body.date && req.body.date.trim();
    const author = req.body.author && req.body.author.trim();
    const image = req.body.image && req.body.image.trim();

    const object = {};
    if (title) object.title = title;
    if (category) object.category = category;
    if (body) object.body = body;
    if (tags) object.tags = tags;
    if (date) object.date = date;
    if (author) object.author = author;
    if (image) object.image = image;

    console.log(object);
    Blog.update({_id: req.params.id}, object, (err, blog) => {
        if (err) res.json({code: 400, message: "error", data: err})
        else res.json({code: 200, message: "success", data: object})
    });

};

exports.deleteBlog = (req, res) => {
    Blog.remove({_id: req.params.id}, err => {
        if (err) res.json({code: 400, message: "error", data: err})
        else res.json({code: 200, message: "deleted post with id" + req.params.id})
    })
};