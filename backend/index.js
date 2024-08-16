import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRoute from "./Routes/user.js";

dotenv.config()
const app = express()
const port = process.env.PORT || 8000
app.get('/',(req,res)=>{
    res.send("API IS WORKING")
})
mongoose.set("strictQuery",false)
const connnectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB is connected")
    } catch (error) {
        console.log("Failure to connect to database"+error)
    }
}
const corsoption = {
    origin:true,
}
app.use(cors(corsoption))
app.use(cookieParser())
app.use(express.json())
app.use('/user',userRoute)
app.listen(port,()=>{
    connnectdb()
    console.log("Server running on port "+port)
})