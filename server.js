'use strict';

// Require
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const weatherHandler = require('./modules/weather.js');
const getMovies = require('./modules/movies.js');
const getRestaurants = require('./modules/restaurants');

// Use
const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('my awesome server');
});

app.get('/weather', weatherHandler);

app.get('/movies', getMovies); 

app.get('/restaurants', getRestaurants);

app.get('*', (req, res) => {
  res.send('no route');
});

// Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
})

// Listen
app.listen(PORT, () => console.log(`Server up on ${PORT}`));