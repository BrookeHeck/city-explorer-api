'use strict';

// Require, use, routes, errors, listen

//Require
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./weather.js');
const getMovies = require('./movies.js');


// Use
const app = express();
const PORT = process.env.PORT || 3002;

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Hello there!');
});

app.get('/weather', getWeather);

app.get('/movies', getMovies);

app.get('*', (request, response) => {
  response.send('no route');
});

// Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


