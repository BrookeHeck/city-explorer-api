const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY;

function getRestaurants(request, response, next) {
  let params = {
    term: 'restaurants',
    lat: request.query.lat,
    lon: request.query.lon
  }
  axios.get({ config })
    .then(function (restaurantData) {
      response.status(200).send(restaurantData.data);
    })
    .catch(function (error) {
      Promise.resolve().then(() => {
        throw new Error(error.message);
      }).catch(next);
    });
}

module.exports = getRestaurants;

