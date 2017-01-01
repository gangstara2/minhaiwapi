const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    body: String,
    tags: String,
    category: {type: String, default: 'uncategorized'},
    date: {type: Date, default: Date.now},
    author: {type: String, default: 'anonymous'},
    image: {type: String, default: 'noimage.jpg'},
    comments: [{
        name: {type: String},
        email: {type: String},
        body: {type: String},
        commentDate: {type: Date, default: Date.now}
    }]
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
module.exports.getBlogs = function (callback, limit, skip, sort = '-date') {
    Blog.find(callback).sort(sort).limit(limit).skip(skip);
};
