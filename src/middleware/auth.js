const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

async function verifyToken(token) {
    try {
        let { email } = await jwt.verify(token, process.env.SECRET)        
        return email
    } catch (error) {
        throw new Error('Invalid or expired token')
    }
}


module.exports = {
    verifyToken
};
