'use strict';

// Require, use, routes, errors, listen

//Require
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const allData = require('./weather.json');
const axios = require('axios').default;


// Use
const app = express();
const PORT = process.env.PORT || 3002;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.send('Hello from our server');
});

app.get('/weather', (request, response, next) => {
  console.log(request.query);
  axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
    params: {
      key: WEATHER_API_KEY,
      lat: request.query.lat,
      lon: request.query.lon,
      days: '5',
      units: 'I'
    }
  }).then(function (weatherData) {
    let fiveDayForecast = weatherData.data.data.map(forecast => {
      return new Forecast(forecast);
    })
    response.send(fiveDayForecast);
  }).catch(function (error) {
    next(error);
  }).then(function () {
    console.log('Data not found');
  });
});

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
  }).then(function () {
    console.log('Data not found');
  })
});

app.get('*', (request, response) => {
  response.send('no route');
});

// Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Classes
class Forecast {
  constructor(weatherData) {
    this.temp = weatherData.temp;
    this.description = weatherData.weather.description;
    this.date = weatherData.datetime;
  }
}

class Movie {
  constructor(movieData) {
    this.title = movieData.original_title;
    this.overview = movieData.overview;
    this.imgPath = 'https://image.tmdb.org/t/p/w500' + movieData.poster_path;
    this.id = movieData.id;
  }
}


// Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


