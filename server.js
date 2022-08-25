'use strict';

// Require, use, routes, errors, listen

//Require
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios').default;
const getWeather = require('./weather.js');


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

app.get('/movies', (request, response, next) => {
  axios.get('https://api.themoviedb.org/3/search/movie', {
    params: {
      api_key: MOVIE_API_KEY,
      query: request.query.city
    }
  }).then(function (movieData) {
    let movieArr = movieData.data.results.map(movie => new Movie(movie));
    response.send(movieArr);
  }).catch(function (error) {
    next(error);
  });
});

app.get('*', (request, response) => {
  response.send('no route');
});

// Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Classes


class Movie {
  constructor(movieData) {
    this.title = movieData.original_title;
    this.overview = movieData.overview;
    this.imgPath = movieData.poster_path ? 'https://image.tmdb.org/t/p/w500' + movieData.poster_path : '';
    this.id = movieData.id;
  }
}


// Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


