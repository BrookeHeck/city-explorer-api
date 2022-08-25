const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

async function getWeather(request, response, next) {
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