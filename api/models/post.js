const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: { type: String },
  likes: { type: Array, default: []},
  user_id: { type: String },
}, {timestamps: true});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
