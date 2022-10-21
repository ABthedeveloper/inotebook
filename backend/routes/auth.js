const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// create a User using: POST "/api/auth/createuser". no login required

router.post('/createuser',
    [body('name','Enter a Valid Name').isLength({ min: 5 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 character').isLength({ min: 5 })],

    //if there are errors, return Bad request and the errors
    async(req, res) => {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        // check whether the user with this email exists already

        try{
    
       let user = await User.findOne({email: req.body.email});
       console.log(user)
       if(user){
        return res.status(400).json({error:"sorry a user with this email already exist"})
       }

       // Create a new user
       const salt = bcrypt.genSaltSync(10);
       const secPass = await bcrypt.hash(req.body.password, salt)  

       user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
          })
          
          .then(user => res.json(user));

        } catch(error){

            console.error(error.message);
            res.status(500).send("some error occured");
            
        }


    })

module.exports = router