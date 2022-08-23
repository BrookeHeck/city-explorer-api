'use strict';

// Require, use, routes, errors, listen

//Require
const express = require('express');
require('dotenv').config();

// Use
const app = express();
const PORT = process.env.PORT || 3002;

// Routes
app.get('/', (request, response) => {
  response.send('Hello from our server');
});

app.get('/weather', (request, response) => {
  let obj = new Weather(request.query.searchQuery, request.query.lat, request.query.lon);
  response.send(obj);
});

app.get('*', (request, response) => {
  response.send('no route');
});

// Errors

// Classes
class Weather {
  constructor(searchQuery, lat, lon) {
    this.searchQuery = searchQuery;
    this.lat = lat;
    this.lon = lon;
  }
}


// Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


