const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const Post = require('../models/Post');
const User = require('../models/User');

const uploadToCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'posts' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        Readable.from(buffer).pipe(stream);
    });
};

exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            imageUrl = uploadResult.secure_url;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image or video is required' });
        }

        const newPost = await Post.create({
            postedBy: req.user._id,
            imageUrl,
            caption,
        });

        //add post to user's posts array
        await User.findByIdAndUpdate(req.user._id, { $push: { posts: newPost._id } });

        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong while creating post' });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const postId = await Post.findById(req.params.postId);
        if (!postId) {
            return res.status(404).json({ message: 'Post not found' });
        }
        //check for post ownership
        if (postId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }
        //delete post
        await Post.findByIdAndDelete(req.params.postId);
        //remove post from user's posts array
        await User.findByIdAndUpdate(req.user._id, { $pull: { posts: req.params.postId } });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong while deleting post' });
    }

}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('postedBy', 'username profilePicture')
            .populate('comments.postedBy', 'username profilePicture')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong while fetching posts' });
    }
}

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate('postedBy', 'username profilePicture')
            .populate('comments.postedBy', 'username profilePicture');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);

    } catch (err) {
        res.status(500).json({ message: 'Something went wrong while fetching the post' });
    }
}

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        //check if user already liked the post
        if (post.likes.includes(req.user._id)) {
            post.likes.pull(req.user._id);
            await post.save();
            return res.status(200).json({ message: 'Post unliked successfully' });
        }
        post.likes.push(req.user._id);
        await post.save();
        res.status(200).json({ message: 'Post liked successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong while liking the post' });
    }
}

exports.commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }
        const comment = {
            text,
            postedBy: req.user._id,
            success: true
        };
        post.comments.push(comment);
        await post.save();
        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong while commenting on the post' });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) { 
            return res.status(404).json({ message: 'Post not found' });
        }
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        //check for comment ownership
        if (comment.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
        post.comments.pull(req.params.commentId);   
        await post.save();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong while deleting the comment' });
    }
}

exports.updatePost = async (req, res) => {
    try {
        const { caption } = req.body;
        let imageUrl = req.body.imageUrl;
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        //check for post ownership
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            imageUrl = uploadResult.secure_url;
        }

        if (caption !== undefined) post.caption = caption;
        if (imageUrl !== undefined) post.imageUrl = imageUrl;
        await post.save();
        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong while updating the post' });
    }
}

exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ postedBy: userId })
      .populate('postedBy', 'username profilePicture')
      .populate('comments.postedBy', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong while fetching user posts' });
  }
};
