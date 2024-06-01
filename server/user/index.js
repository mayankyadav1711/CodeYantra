//sample app 
const express = require('express')

const PORT = 8000

const app = express()

app.get('/', (req, res) => res.json({ msg: 'Express Server Setup.' }));

app.listen(PORT, () => console.log(`Say hello to server on Port : ${PORT}`))