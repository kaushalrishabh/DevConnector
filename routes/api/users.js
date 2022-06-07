const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
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
    (req, res) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        
        console.log(req.body);
        res.send('user route')
    });

module.exports = router;