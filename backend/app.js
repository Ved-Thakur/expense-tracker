const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs')
const cookiesparser = require('cookie-parser')
const app = express()

app.use(cookiesparser())
require('dotenv').config()

const PORT = 5000

//middlewares
app.use(express.json())
const corsConfig = {
    origin: true,
    credentials: true,
};
app.use(cors(corsConfig))


//routes
readdirSync('./routes').map((route) => app.use('/expense', require('./routes/' + route)))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()