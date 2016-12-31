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
    }, 10);
};

exports.addBlog = (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        category: req.body.category ? req.body.category : 'uncategorized',
        date: req.body.date ? req.body.date : new Date(),
        author: req.body.author,
        image: req.body.image ? req.body.image : 'noimage.jpg'
    });
    blog.save(err => {
        if (err) {
            res.json({code: 400, message: "error", data: err})
        } else {
            res.json({
                code: 200,
                message: "new blog added successfully",
                data: blog
            })
        }
    })
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
    req.checkBody('title', 'Title field is required').notEmpty()

    const errors = req.validationErrors();
    if (errors) {
        res.json({
            code: 400,
            message: "error",
            data: errors
        });
    } else {
        //submit to db
        Category.insert({
            "title": title
        }, (err, category) => {
            if (err) {
                res.json({code: 400, message: "error", data: err})
            } else {
                res.json({code: 200, message: "success", data: category})
            }
        })
    }
};