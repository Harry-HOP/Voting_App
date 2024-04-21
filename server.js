const express = require('express')
const db = require('./db')
const app = express()
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000

app.get('/',function (req, res) {
    res.send('Hello World')
  }) 
  

//   Import the router file
const userRouter = require('./routes/userRoutes');
const candiateRouter = require('./routes/candiateRoutes');

// use the routers
app.use('/user', userRouter);
app.use('/candiate', candiateRouter);

app.listen(PORT,()=>{console.log("Site is live")})