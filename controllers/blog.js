/**
 * Created by MyPC on 31/12/2016.
 */
const Blog = require('../models/Blog');
const Category = require('../models/BlogCategory');

exports.blog = (req, res) => {
    Blog.find({}, function (err, posts) {
        res.render('blog/index', {
            "posts": posts
        })
    })
};

exports.getAddBlog = (req, res) => {
    Category.find({}, function (err, categories) {
        res.render('blog/add', {
            'title': "Add post",
            'categories': categories
        })
    })
};

exports.postAddBlog = (req, res) => {
    const title = req.body.title;
    const category = req.body.category;
    const body = req.body.body;
    const author = req.body.author;
    const tags = req.body.tags;
    const date = new Date();
    let mainImageName = '';
    if (req.file) {
        mainImageName = req.file.filename
    } else {
        mainImageName = 'noimage.jpg';
    }

    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.render('addpost', {
            'errors': errors,
            'title': title,
            'body': body
        });
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
                res.send('There was an issue submitting the post')
            } else {
                req.flash('success', {msg: 'Post submited!.'});
                res.location('/blog');
                res.redirect('/blog');
            }
        })
    }
};