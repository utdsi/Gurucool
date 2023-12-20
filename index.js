
const express = require("express")
const cors = require("cors")



const app = express()

app.use(express.json())
app.use(cors())


const {connection} = require("./config/db")
const {userRouter} = require("./route/user.route.js")
const {urlRouter} = require("./route/url.route")



require('dotenv').config()


app.use("/",userRouter)
app.use("/url",urlRouter)



app.get("/", (req,res)=>{

    
    res.send("welcome to my app")
    
})

app.listen(process.env.port,async ()=>{

    try {
        await connection
        console.log("connected to database")
    } catch (error) {
        console.log(error)
    }
    console.log("connected to port")
})