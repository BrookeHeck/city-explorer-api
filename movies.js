const axios = require('axios');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

async function getMovies(request, response, next) {
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
  });
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