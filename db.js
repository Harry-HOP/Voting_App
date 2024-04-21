const mongoose = require('mongoose'); 
require('dotenv').config();  

const mongoURL = process.env.DB_URL_LOCAL

// const mongoURL = process.env.DB_URL

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


const db = mongoose.connection;

  db.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });
  
  db.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
  });
