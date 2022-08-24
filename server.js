'use strict';

// Require, use, routes, errors, listen

//Require
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const allData = require('./weather.json');


// Use
const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.send('Hello from our server');
});

app.get('/weather', (request, response, next) => {
  try {
    let forecastObjArr = (getForecast(request.query.city));
    response.send(forecastObjArr);
  } catch(e) {
    next(e.message);
  }
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
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

let getForecast = (searchQuery) => {
  let weatherObj = allData.find(obj => obj.city_name === searchQuery);
  let objData = weatherObj.data;
  let forecastArr = objData.reduce((accumulator, current) => {
    let description = `Low of ${current.app_min_temp}, high of ${current.app_min_temp} with ${current.weather.description.toLowerCase()}`;
    let date = current.valid_date;
    let forecast = new Forecast(description, date);
    accumulator.push(forecast);
    return accumulator;
  }, []);
  return forecastArr;
}


// Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


