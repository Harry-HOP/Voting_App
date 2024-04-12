const express = require('express')
const app = express()
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000






app.listen(PORT,()=>{console.log("Site is live")})