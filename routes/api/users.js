const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const config = require('config');
const gravatar = require('gravatar'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


// @Route   POST api/users
// @desc    Register User
// @access  Public

router.post(
    '/', 
    [
        check('name','Name is Required')
        .not()
        .isEmpty(),
        check('email', 'Email is Invalid')
        .isEmail(),
        check( 'password', 'Password should be more than 6 characters')
        .isLength({min: 6})
    ],
    async(req, res) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        
        const {name, email, password} = req.body    
        
        try
        {
            // See if users exists
            let user = await User.findOne({ email });
            if(user)
                return res.status(400).json({ errors: [{msg: 'User already exists' }] });
            
            //Get users Gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            }) 
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // encrypt password using bcrypt 
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            await user.save();

            // Return JsonWebToken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) => {
                        if(err) throw err;
                        res.json( { token });
                     }
            );
            
        }
        catch(err)
        {
            console.error(err.message);
            res.status(500).send("Server Error");
        }

    });

module.exports = router;