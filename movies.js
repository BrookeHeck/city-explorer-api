const axios = require('axios');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

function getMovies(request, response, next) {
  let params = {
    api_key: MOVIE_API_KEY,
    query: request.query.city
  }

  axios.get('https://api.themoviedb.org/3/search/movie', {params}).then(function (movieData) {
    let movieArr = movieData.data.results.map(movie => new Movie(movie));
    response.status(200).send(movieArr);
  }).catch(function (error) {
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
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