const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./src/routes/route');

const app = express();

app.use(express.json());

mongoose.connect(process.env.DB)


const port = process.env.PORT

app.use("/",routes)


app.listen(port,()=>{
console.log(`server is running on ${port}`)
})