const jwt = require("jsonwebtoken")

require('dotenv').config()


const auth = (req,res,next)=>{


    const token  = req.headers?.authorization

    if(token){
        const decoded = jwt.verify(token,process.env.secret_key)

        if(decoded){
            if(!req.body.userId){
                req.body.userId = decoded.userId
            }
            next()
        }
    }
}

module.exports = {auth}