
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")



const userRouter = express.Router()
require('dotenv').config()
const { UserModel } = require("../model/user.model.js")

// -------------------------------Register-----------------------------------------

userRouter.post("/register", async (req, res) => {

    let { username, email, password } = req.body

    bcrypt.hash(password, 6, async function (err, hash) {
        // Store hash in your password DB.

        if (err) {
            console.log({ "error in hashing": err })
        } else {

            const user = new UserModel({ email, password: hash, username })
            await user.save()
            res.send("signup successful")
        }
    });
})

// -------------------------------Login-----------------------------------------

userRouter.post("/login", async (req, res) => {

    const { email, password } = req.body

    try {

        const user = await UserModel.find({ email })

        if (user.length > 0) {
            const hash_password = user[0].password

            bcrypt.compare(password, hash_password, function (err, result) {
                // result == true
                if (result) {

                    const token = jwt.sign({ "userId": user[0]._id }, process.env.secret_key);

                    res.send({ "msg": "login successfull", "userId": user[0]._id, "token": token, "type": user[0].userType })
                } else {
                    res.send("login failed")
                }
            });
        } else {
            res.send("user not found")
        }

    } catch (error) {
        console.log(error)
    }
})










module.exports = { userRouter }