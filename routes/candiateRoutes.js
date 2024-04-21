const express = require('express');
const router = express.Router();
const Candiate = require('../models/candidate');
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt');

const checkAdminRole = async (userID) => {
    
    try{
        const user = await User.findById(userID);
        return user==='admin';
    }
    catch(err){
        return false;
    }
}

router.post('/',jwtAuthMiddleware ,async(req, res) => {
    if(!(await checkAdminRole(req.user.id))){
        return res.status(404).json({message: "User is not a Admin"});
    }
    try{

        const data = req.body;
    
        // Save the user to the database
        // ...
        const newCandiate = new Candiate(data)

        const resposnse = await newCandiate.save();
        console.log("Data Saved");

        res.status(200).json({resposnse});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Errorrrr'});
    }
})

router.get('/',jwtAuthMiddleware ,async(req, res) => {

    try{
        const data = await Candiate.find();
        res.status(200).json(data);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});

    }

  })


  router.put('/:candiateID', jwtAuthMiddleware,  async(req, res) => {
    try{
        if(!(await checkAdminRole(req.user.id))){
            return res.status(404).json({message: "User is not a Admin"});
        }

        const candiateId = req.params.candiateID;
        const candiatedata = req.body;

         const response = await User.findByIdAndUpdate(candiateId, candiatedata, {
            new: true,
            runValidators: true,
         })

         console.log("Data updated");
         res.status(200).json(response);

        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
  })

  router.delete('/:candiateId',jwtAuthMiddleware ,async(req, res) => {
    try{
        if(!(await checkAdminRole(req.user.id))){
            return res.status(404).json({message: "User is not a Admin"});
        }

        const candiateID = req.params.candiateId;

        const response = await Candiate.findByIdAndDelete(candiateID);

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


  // let's start voting
  router.post('/vote/:candiateID', jwtAuthMiddleware, async(req, res) => {
    //no admin can vote
    // user can only vote once

    candiateID = req.params.candiateID;
    userId = req.user.id;

    try{
        const candiate = await Candiate.findById(candiateID);
        if(!candiate){
            return res.status(404).json({message: 'candiate not found'});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'user not found'});
        }
        if(user.isVoted){
            res.status(400).json({message: 'You have already voted'});
        }
        if(user.role == 'admin'){
            res.status(403).json({message: 'admin is not allowed'});
        }

        // Update the candiate document to record the vote
        candiate.votes.push({user: userId});
        candiate.voteCount++;
        await candiate.save();

        // update the user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({message: 'vote recoded successfully'});

         


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
  })

  router.get('/vote/count', async (req, res) => {
    try{
        const candiate = await Candiate.find().sort({voteCount: 'desc'});

        const voteRecord = candiate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);


    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
  })

  module.exports = router;