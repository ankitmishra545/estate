import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_DB).then(() => {
    console.log("MongoDB successfully connected")
}).catch((err) => {
    console.log(err)
}) 

const app = express()

app.listen(3000, () => {
    console.log("Server is listening the port 3000!!!")
})