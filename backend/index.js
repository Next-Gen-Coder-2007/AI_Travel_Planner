const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./src/config/connectDB')
const cookieParser = require("cookie-parser")
const userRoutes = require('./src/routes/user.routes')
const tripRoutes = require('./src/routes/trip.routes')
dotenv.config()

const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())

app.use('/user', userRoutes)
app.use('/plan', tripRoutes)

connectDB().then(() => {
    const port = process.env.PORT || 5000
    app.listen(port, () => {
        console.log(`Server running on PORT ${port}`)
    })
})