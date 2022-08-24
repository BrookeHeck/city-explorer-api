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
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.send('Hello from our server');
});

app.get('/weather', (request, response, next) => {
    axios.get('https://api.weatherbit.io/v2.0/current', {
      params: {
        key: WEATHER_API_KEY,
        lat: request.query.lat,
        lon: request.query.lon
      }
    }).then(function (weatherData) {
      let forecast = new Forecast(weatherData.data.data[0]);
      response.send(forecast);
    }).catch(function (error) {
      next(error);
    }).then(function () {
      console.log('Data not found');
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
class Forecast {
  constructor(weatherData) {
    this.temp = weatherData.app_temp;
    this.description = weatherData.weather.description;
    this.date = weatherData.ob_time;
  }
}


// Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


