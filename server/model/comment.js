const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: String,
    date: Date,
    user: {
        avatar: String,
        username: String,
    }
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;