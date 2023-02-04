"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tmdbSearch = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../../utils/constants");

var _model = require("./model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tmdbSearch = async (names, releaseDate) => {
  const ax = names.map(e => {
    return _axios.default.get(encodeURI(`${_constants.tmdbHost}/search/movie?${_constants.tmdbKeyQuery}&query=${e}&year=${releaseDate}`));
  });
  let resData = [];

  for (const res of ax) {
    (await res).data["results"].forEach(e => {
      resData = [...resData, e];
    });
  }

  return (0, _model.toMovieFromTmdb)(resData);
};

exports.tmdbSearch = tmdbSearch;