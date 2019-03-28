const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const LabelSchema = new Schema({
    name: String,
    article: [{
        type: ObjectId,
        ref: 'Article'
    }],
    artCount: {
        type: Number,
        default: 0
    }
})

LabelSchema.pre('save', function (next) {
    this.artCount = this.article.length
    next()
})


const Label = mongoose.model('Label', LabelSchema)

module.exports = Label;