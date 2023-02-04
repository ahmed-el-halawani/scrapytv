"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TmdbFilter = exports.egybestMovieTrending = exports.TmdbTrending = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../../utils/constants");

var _model = require("./model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Object} trending
 * @param {mediaType} trending.media_type
 * @param {timeWindow} trending.time_window
 * @param {number} trending.page
 */
const TmdbTrending = async ({
  media_type = _constants.mediaType.movie,
  time_window = _constants.timeWindow.day,
  page = 1
}) => {
  const resData = await _axios.default.get(`https://api.themoviedb.org/3/trending/${media_type}/${time_window}?${_constants.tmdbKeyQuery}&page=${page}`);
  return (0, _model.toMovieFromTmdb)(resData.data["results"]);
};
/**
 * @param {Object} trending
 * @param {timeWindow} trending.time_window
 * @param {number} trending.page
 */


exports.TmdbTrending = TmdbTrending;

const egybestMovieTrending = async ({
  time_window = _constants.egybestTimeWindow.day,
  page = 1
}) => {
  if (req != null && req.query.page != null) {
    page = req.query.page;
  } else if (index != null) {
    page = index;
  }

  let data = null;
  data = (await _axios.default.get(`${HOST}/trending/${time_window}?page=${page}&output_format=json`)).data;

  try {
    data = toMovieFromEgybest($("div #movies", data.html).children("*"));
    return {
      page,
      data
    };
  } catch (error) {
    return {
      error,
      e: "what is this error"
    };
  }
};
/**
 * @param {Object} trending
 * @param {mediaType} trending.media_type
 * @param {timeWindow} trending.time_window
 * @param {number} trending.page
 */


exports.egybestMovieTrending = egybestMovieTrending;

const TmdbFilter = async ({
  media_type = _constants.mediaType.movie,
  time_window = _constants.timeWindow.day,
  page = 1
}) => {
  const resData = await _axios.default.get(`https://api.themoviedb.org/3/trending/${media_type}/${time_window}?${_constants.tmdbKeyQuery}&page=${page}`);
  return (0, _model.toMovieFromTmdb)(resData.data["results"]);
};

exports.TmdbFilter = TmdbFilter;