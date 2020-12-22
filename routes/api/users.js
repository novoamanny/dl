const express = require('express');
const {check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const keys = require('../../config/default');

const router = express.Router();

const USER = require('../../models/User');


router.post('/enroll',
    [
        check('First_Name', 'First Name is required!').not().isEmpty(),
        check('Last_Name', 'Last Nmme is required!').not().isEmpty(),
        check('Email', 'Pleae include a valid email!').isEmail(),
        check('Password', 'Please enter a password with 8 or moore characters!').isLength({min: 8})
    ],
    async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {First_Name, Last_Name, Email, Password} = req.body;

        try{
            let user = await USER.findOne({Email});

            if(user){
                return res.status(400).json({errors: [{msg: 'User already exists!'}]})
            }

            user = new USER({
                First_Name,
                Last_Name,
                Email,
                Password
            });


            const salt = await bcrypt.genSalt(10);

            user.Password = await bcrypt.hash(Password, salt);

            await user.save();

            const payload = {
                user: {
                id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                if (err) throw err;
                res.json({ token });
                }
            );

        }catch(err){
            console.log(err.message);
            res.status(500).send('Server Error!')
        }
    }
)

module.exports = router;