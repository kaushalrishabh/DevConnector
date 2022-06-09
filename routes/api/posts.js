const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Posts = require('../../models/Post');
const config = require('config');
const Post = require('../../models/Post');

// @Route   POST api/posts
// @desc    Create a Post
// @access  Private

router.post('/', 
    [ 
        auth, 
        [   
            check('text','Text is required')
            .not()
            .isEmpty()
        ] 
    ],  
    async(req, res) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({errors : errors.array() });

        try
        {
            const user = await User.findById(req.user.id).select('-password');
    
            const newPost = new Post(
            {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            res.json(post);
        }
        catch(err)
        {
            console.error(err.message);
            res.status(400).send('Server Errors');
        }

    }
);

// @Route   GET api/posts
// @desc    GET all Post
// @access  Private

router.get('/', auth, async(req, res)=>{
    try
    {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send(' Server Error');
    }

});

// @Route   GET api/posts/:id
// @desc    GET post by ID
// @access  Private

router.get('/:id', auth, async(req, res)=>{
    try
    {
        const posts = await Post.findById(req.params.id);
        
        if(!posts)
            return res.status(404).send('Post not found');
        
        res.json(posts);
    }
    catch(err)
    {
        console.error(err.message);
        if(err.kind ==='ObjectId')
            return res.status(404).send('Post not found');
        
        res.status(500).send(' Server Error');
    }

});

// @Route   DELETE api/posts
// @desc    Delete a Post
// @access  Private

router.delete('/:id', auth, async(req, res)=>{
    try
    {
        const posts = await Post.findById(req.params.id);
     
        // Check User

        if(!posts)
            return res.status(404).send('Post not found');

        if(posts.user.toString() !== req.user.id)
            return res.status(401).send('User not Authorized');
        
        await posts.remove();
        
        res.json({ msg: 'Post Removed'});
    }
    catch(err)
    {
        console.error(err.message);
        if(err.kind ==='ObjectId')
            return res.status(404).send('Post not found');
     
        res.status(500).send(' Server Error');
    }

});

// @Route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private

router.put('/like/:id', auth, async(req, res) => {

    try
    {
        const post = await Post.findById(req.params.id);

        //Check if the post has been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length >0)
            return res.status(400).send('Post already liked');
    
        post.likes.unshift({ user: req.user.id});
        
        await post.save();
        res.json(post.likes);
    
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @Route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private

router.put('/unlike/:id', auth, async(req, res) => {

    try
    {
        const post = await Post.findById(req.params.id);

        //Check if the post has been liked
        if(post.likes.filter(like=> like.user.toString() === req.user.id).length === 0)
            return res.status(400).send('Post has not yet been liked');
    
        //Get remove index

        const removeIndex = post.likes.map(like=> like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);


        await post.save();
        res.json(post.likes);
    
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;