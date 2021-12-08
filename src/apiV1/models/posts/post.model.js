const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    post: {
        type: String,
        required: [true, 'Please input your Twit']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;