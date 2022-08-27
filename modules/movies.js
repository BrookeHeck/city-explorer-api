const axios = require('axios');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

let cache = {};

function getMovies(request, response, next) {
  let city = request.query.city;
  let key = city.toLowerCase() + 'Data';
  let timeToCache = 1000 * 60 * 60 * 24 * 30;
  // let testCache = 1000 * 20;

  if (cache[key] && Date.now() - cache[key].timestamp < timeToCache) {
    console.log('movie cache hit');
    response.status(200).send(cache[key].data);
  } else {
    console.log('movie cache miss');
    let params = {
      api_key: MOVIE_API_KEY,
      query: city
    }
    axios.get('https://api.themoviedb.org/3/search/movie', {params})
    .then(function (movieData) {
      let movieArr = movieData.data.results.map(movie => new Movie(movie));
      cache[key] = {
        data: movieArr,
        timestamp: Date.now()
      }
      response.status(200).send(movieArr);
    })
    .catch(function (error) {
      Promise.resolve().then(() => {
        throw new Error(error.message);
      }).catch(next);
    });
  }
}

class Movie {
  constructor(movieData) {
    this.title = movieData.original_title;
    this.overview = movieData.overview;
    this.imgPath = movieData.poster_path ? 'https://image.tmdb.org/t/p/w500' + movieData.poster_path : '';
    this.id = movieData.id;
  }
}

module.exports = getMovies;