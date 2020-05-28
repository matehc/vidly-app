const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true } )
.then(() => console.log('Connected to database...'))
.catch((err) => console.log('Error connecting to database', err.message));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//routes 
const genreRouter = require('./routes/genres');


app.use('/api/genres', genreRouter);


app.use(express.json());


app.listen(3000);