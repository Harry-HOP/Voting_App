const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // first check request headers has authorization or not
    const authorization = req.headers.authorization;
    if(!authorization){ return res.status(401).json({error: 'Token Not Found'});
}
    // Extract the jwt tokken from the request header
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try{
        //Verify the Jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach user information to the request object
        req.user = decoded
        next();

    }
    catch(err){
        console.log(err);
        res.status(401).json({error: 'Invalid token'});
    }
}

// Function to generate JWT Token
const generateToken = (userData) => {
    //generate a new JWT Token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
}

module.exports = {jwtAuthMiddleware, generateToken};