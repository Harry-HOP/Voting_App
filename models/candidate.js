const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
// Define the User schema
const candidateSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
 },
 party: {
    type: String,
    required: true,
 },
 age: {
    type: Number,
    required: true,
 },
 votes: [
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        votedAt:{
            type: Date,
            default: Date.now()
        }
    }
 ],
 voteCount: {
    type: Number,
    default: 0
 }

 
});

// Create the User model from the schema
const candidate = mongoose.model('candidate', candidateSchema);
module.exports = candidate;