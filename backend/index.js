const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./src/config/connectDB')
const cookieParser = require("cookie-parser")
dotenv.config()

const app = express();

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get('/api', (req, res) => {
    res.status(201).json({ message :"Message Sended Successful"})
})

connectDB().then(() => {
    const port = process.env.PORT || 5000
    app.listen(port, () => {
        console.log()
    })
})