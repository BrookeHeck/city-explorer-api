'use strict';

const axios = require('axios');
let cache = require('./cache.js');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

function handleWeather(request, response, next) {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let timeToCache = 1000 * 60 * 60;
  // let testCache = 1000 * 20;
  const key = 'weather-' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;

  if (cache[key] && (Date.now() - cache[key].timestamp < timeToCache)) {
    console.log('weather cache hit');
    response.status(200).send(cache[key].data);
  } else {
    console.log('weather cache miss');
    axios.get(url)
    .then(weatherData => {
      cache[key] = {
        data: parseWeather(weatherData.data),
        timestamp: Date.now()
      }
      response.status(200).send(cache[key].data);
    })
    .catch((error) => {
      Promise.resolve().then(() => {
        throw new Error(error.message);
      }).catch(next);
    });
  }
}

function parseWeather(weatherData) {
  const weatherSummaries = weatherData.data.map(day => {
    return new Weather(day);
  });
  return weatherSummaries;
}

class Weather {
  constructor(day) {
    this.temp = day.temp;
    this.description = day.weather.description;
    this.date = day.datetime;
  }
}

module.exports = handleWeather;