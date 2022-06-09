const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @Route   GET api/profile/me
// @desc    Get current user profile
// @access  Private

router.get('/me', auth,async(req, res) => 
{
    try
    {
        const profile = await Profile.findOne({ user: req.user.id }).populate
        ('user',
         ['name', 'avatar']
        );

        if(!profile)
        {
            return res.status(400).json({ msg: 'There is no Profile for this User'});
        }
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Send Error');
    }
});

// @Route   POST api/profile/me
// @desc    Create and update user profile
// @access  Private

router.post(
    '/', 
    [
        auth,
        [
            check('status', 'Status is required')
            .not()
            .isEmpty(),
            check('skills', 'Skills is required')
            .not()
            .isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const 
        {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Build User Profile
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;

        if(skills)
            profileFields.skills = skills.split(',').map(skill => skill.trim());

        //Build Social object
        profileFields.social ={};

        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;
        
        try
        {
            let profile = await Profile.findOne({ user: req.user.id});
            
            //Update existing Profile
            if(profile)
            {   
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id},
                    { $set: profileFields}, 
                    { new: true} 
                );
                return res.json(profile);
            }
            
            //Create New Profile
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);

        }
        catch(err)
        {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @Route   GET api/profile
// @desc    Get all profile
// @access  Private

router.get('/', async(req, res) => {
 
    try
    {
        const profiles = await Profile.find().populate('user', ['name','avatar']);
        res.json(profiles);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).json('Send Error');
    }

});

// @Route   GET api/profile/user/:user_id
// @desc    Get profiles by ID
// @access  Public

router.get('/user/:user_id', async(req, res) => {
 
    try
    {
        const profiles = await Profile.findOne(
            {user : req.params.user_id}
        )
        .populate('user', 
            [
                'name','avatar'
            ]
        );

        if(!profiles) 
            return res.status(400).json({msg: 'Profile not found'});
        
        res.json(profiles);
    }
    catch(err)
    {
        console.error(err.message);
        if(err.kind == 'ObjectId')
            return res.status(400).json({msg: 'Profile not found'});
        
            res.status(500).send('Send Error');
    }

});

// @Route   DELETE api/profile/
// @desc    DELETE profiles by ID
// @access  Private

router.delete('/', auth,async(req, res) => {
 
    try
    {
        //todo - Remove User posts
        
        //Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id});
        // Remove User
        await User.findOneAndRemove({ _id: req.user.id});

        res.json({msg: 'User removed'});
    }
    catch(err)
    {
        console.error(err.message);
        if(err.kind == 'ObjectId')
            return res.status(400).json({msg: 'Profile not found'});
        
            res.status(500).send('Send Error');
    }

});

// @Route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
 
router.put('/experience', 
    [ 
        auth,
        [
            check('title','Title is required')
            .not()
            .isEmpty(),
            check('company','Company is required')
            .not()
            .isEmpty(),
            check('from','from date is required')
            .not()
            .isEmpty(),
        ]
    ], 
    async(req, res) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({ errors: error.array() });
    
        const 
        {   
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body
        
        const newExp = 
        {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try
        {
            const profile = await Profile.findOne({ user: req.user.id});
            if(!profile)
                return res.status(404).send('Create Profile First');

            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        }
        catch(err)
        {
                console.error(err.message);
                res.status(500).send('Server Error');
        }
    }
);
// @Route   DELETE api/profile/experience
// @desc    DELETE profile experience
// @access  Private
 
router.delete('/experience/:exp_id', auth, 
    async(req, res) => 
    {
        try
        {
            const profile = await Profile.findOne({ user: req.user.id});
            
            //Get Remove Index
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

            profile.experience.splice(removeIndex, 1);
            await profile.save();
            res.json(profile);
        }
        catch(err)
        {
                console.error(err.message);
                res.status(500).send('Server Error');
        }
    }
);

// @Route   PUT api/profile/Education
// @desc    Add profile Education
// @access  Private
 
router.put('/education', 
    [ 
        auth,
        [
            check('school','School is required')
            .not()
            .isEmpty(),
            check('degree','Degree is required')
            .not()
            .isEmpty(),
            check('fieldofstudy','Field of study is required')
            .not()
            .isEmpty(),
            check('from','from date is required')
            .not()
            .isEmpty(),
        ]
    ], 
    async(req, res) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({ errors: error.array() });
    
        const 
        {   
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body
        
        const newEdu = 
        {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try
        {
            const profile = await Profile.findOne({ user: req.user.id});
            if(!profile)
                return res.status(404).send('Create Profile First');

            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        }
        catch(err)
        {
                console.error(err.message);
                res.status(500).send('Server Error');
        }
    }
);

// @Route   DELETE api/profile/education
// @desc    DELETE profile education
// @access  Private
 
router.delete('/education/:edu_id', auth, 
    async(req, res) => 
    {
        try
        {
            const profile = await Profile.findOne({ user: req.user.id});
            
            //Get Remove Index
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

            profile.education.splice(removeIndex, 1);
            await profile.save();
            res.json(profile);
        }
        catch(err)
        {
                console.error(err.message);
                res.status(500).send('Server Error');
        }
    }
);

// @Route   GET api/profile/github/:username
// @desc    Get User repos from Github
// @access  Public

router.get('/github/:username', (req, res) => {
    try
    {
        const options = 
        {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${ config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js'}
        };
        
        request(options, (errors,response, body) => {
            if(errors) console.errors(error);

            if(response.statusCode !== 200)
                return res.status(404).json({ msg: 'Github Profile not found'});
            
            res.json(JSON.parse(body));
        });
    }
    catch (err)
    {
        console.error(err.message);
        res.status(400).send('Server Error');
    }

});



module.exports = router;

