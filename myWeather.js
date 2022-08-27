const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

let cache = {};

function getWeather(request, response, next) {
  let params = {
    key: WEATHER_API_KEY,
    lat: request.query.lat,
    lon: request.query.lon,
    days: '5',
    units: 'I'
  }

  axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {params})
  .then(function (weatherData) {
    let fiveDayForecast = weatherData.data.data.map(forecast => {
      return new Forecast(forecast);
    });
    response.status(200).send(fiveDayForecast);
  })
  .catch(function (error) {
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  });
}

class Forecast {
  constructor(weatherData) {
    this.temp = weatherData.temp;
    this.description = weatherData.weather.description;
    this.date = weatherData.datetime;
  }
}

module.exports = getWeather;