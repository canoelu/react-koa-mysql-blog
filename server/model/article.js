const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new Schema({
    title: String,
    content: String,
    type: String,
    isPublic: Boolean,
    comment: [{
        type: ObjectId,
        ref: 'Comment'
    }],
    description: String,
    author: {type: ObjectId, ref: 'User'},
    label: [{
        type: ObjectId,
        ref: 'Label'
    }],
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

ArticleSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = new Date().getTime();
    } else {
        this.meta.updateAt = new Date()
    }

    next()
});

const Article = mongoose.model('Article', ArticleSchema)

module.exports = Article;

