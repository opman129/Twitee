const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    like: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;