const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt');

router.post('/login', async(req, res) =>{
    try{
        // Extract username and password from request body
        const {name, password} = req.body;
        
        // Find the user by username
        const user = await User.findOne({name: name});

        // if user does not exist or password does not match , return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate token 
        const payload = {
            id: user.id,
        }

        const token = generateToken(payload);

        //return token as response
        res.json({token});


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Errorrrr'});
    }
})
router.post('/Signup', async(req, res) => {
    try{
        // Get the user data from the request body
    const data = req.body;
  
    // Save the user to the database
    // ...
    const newUser = new User(data)

    const resposnse = await newUser.save();
    console.log("Data Saved");
    const paylod = {
        id: resposnse.id,
        username: resposnse.username
    }
    const token = generateToken(paylod);
    res.status(200).json({resposnse: resposnse, token: token});
  
    // Send a response to the client
    // res.send('User created successfully!');

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
  });


  router.get('/',async(req, res) => {

    try{
        const data = await User.find();
        res.status(200).json(data);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});

    }

  })

router.get('/profile',jwtAuthMiddleware ,async(req, res) => {
    try{
        const userData = req.user;

        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({user});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});

    }
})



  router.put('/profile/password', jwtAuthMiddleware,  async(req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const {currentPassword, newPassword} = req.body

        const user = await User.findById(userId);

         if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'});
         }

         user.password = newPassword;
         await user.save();

         console.log('password updated');
         res.status(200).json({message: 'password updated'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
  })

  router.delete('/:id', async(req, res) => {
    try{
        const personid = req.params.id;

        const response = await User.findByIdAndDelete(personid);

        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }

        console.log("Data Deleted");
        res.status(200).json(response);


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
  })


  module.exports = router;