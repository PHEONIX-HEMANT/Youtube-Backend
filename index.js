const express = require('express')
require('dotenv').config()
const app = express()

app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.get('/login', (req, res)=>{
    res.send('<h1>Logged in</h1>')
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})