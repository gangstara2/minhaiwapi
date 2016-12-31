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

};