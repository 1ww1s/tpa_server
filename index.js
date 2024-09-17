require('dotenv').config()
const express = require('express');
const router= require('./router');
const error = require('./middleware/errorMiddleware')
const sequelize = require('./db')
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser')
const app = express()
const cors = require('cors') 

app.use(cors({
    credentials: true,
    maxAge: 24 * 60 * 60,  // 24h
    origin: process.env.CLIENT_URL  
}))

app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use('/api', router)
app.use(error)


const start = async () => {
    await sequelize.authenticate();
    await sequelize.sync()
    app.listen(PORT, () => console.log(`server started on PORT = ${PORT}`))
}
start()