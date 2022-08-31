const axios = require('axios');

function getRestaurants(request, response, next) {

  axios({
    url: 'https://api.yelp.com/v3/businesses/search',
    headers: { 'Authorization': `Bearer ${process.env.YELP_API_KEY}` },
    params: {
      term: 'restaurants',
      latitude: request.query.lat,
      longitude: request.query.lon
    }
  })
    .then(function (restaurantData) {
      response.status(200).send(restaurantData.data);
    })
    .catch(function (error) {
      console.log(error);
      Promise.resolve().then(() => {
        throw new Error(error.message);
      }).catch(next);
    });
}

class Restaurant {
  constructor(restaurantData) {
    this.id = restaurantData.id;
    this.name = restaurantData.name;
    this.url = restaurantData.url ? restaurantData.url : '';
    this.imgUrl = restaurantData.image_url ? restaurantData.image_url : '';
  }
}

module.exports = getRestaurants;

