const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema({
    title: {type: String, unique: true}
});

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

module.exports = BlogCategory;