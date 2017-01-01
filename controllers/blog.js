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

exports.showBlog = (req, res) => {
    Blog.findById(req.params.id, function (err, post) {
        res.render('blog/show', {
            'post': post
        })
    })
};


exports.addComment = (req, res) => {
    const name = req.body.name;
    const email = req.body.email
    const body = req.body.body
    const postid = req.body.postid;
    const commentDate = new Date();

    //form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not formatted correctly').isEmail();
    req.checkBody('body', 'Body field is required').notEmpty();
    const errors = req.validationErrors();


    if (errors) {
        Blog.findById(postid, function (err, post) {
            res.render('show', {
                'errors': errors,
                'post': post
            });
        })
    } else {
        const comment = {
            "name": name,
            "email": email,
            "body": body,
            "commentdate": commentDate
        }
        Blog.update({
            '_id': postid
        }, {
            $push: {
                "comments": comment
            }
        }, function (err, doc) {
            if (err) {
                throw  err
            } else {
                req.flash('success', {msg: 'Comment Added'});
                res.redirect('/blog/show/' + postid)
            }
        })
    }
};
exports.getAddCategory = (req, res) => {
    res.render('blog/addcategory', {
        'title': 'Add category'
    })
};

exports.postAddCategory = (req, res) => {
    const title = req.body.title;
    //form validation
    req.checkBody('title', 'Title field is required').notEmpty()

    const errors = req.validationErrors();
    if (errors) {
        res.render('blog/addcategory', {
            'errors': errors,
            'title': title
        });
    } else {
        //submit to db
        const newCat = new Category({
            "title": title
        });
        newCat.save((err, category) => {
            if (err) {
                res.json({err: err})
            } else {
                req.flash('success', {msg: 'Category Submitted'});
                res.location('/blog');
                res.redirect('/blog');
            }
        })
    }
};

exports.showBlogByCategory = (req, res) => {
    Blog.find({category: req.params.category}, function (err, posts) {
        res.render('blog/index', {
            "posts": posts
        })
    })
}