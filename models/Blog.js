const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    body: String,
    tags: String,
    category: String,
    date: {type: Date, default: Date.now},
    author: String,
    image: String
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
module.exports.getBlogs = function (callback, limit) {
    Blog.find(callback).limit(limit);
};
