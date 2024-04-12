const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
// Define the User schema
const userSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
 },
 age: {
    type: Number,
    required: true,
 },
 email: {
    type: String,
 },
 mobile:{
    type: String,

 },
 address: {
    type: String,
    required: true,
 },
 adharCardNumber:{
    type: Number,
    required: true,
 },
 password: {
    type: String,
    required: true,
 },
 role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter'
 },
 isVoted:{
    type: boolean,
    default: false
 }
 
});

// Create the User model from the schema
const user = mongoose.model('user', userSchema);
module.exports = user;