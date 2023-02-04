"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tmdbTvSearch2 = exports.tmdbTvSearch = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../../utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tmdbTvSearch = async (names, first_air_date) => {
  const ax = names.map(e => {
    return _axios.default.get(encodeURI(`${_constants.tmdbHost}/search/tv?${_constants.tmdbKeyQuery}&query=${e}`));
  });
  let resData = {};

  for (const res of ax) {
    (await res).data["results"].filter(e => {
      if (first_air_date == null) return true;

      try {
        return String(e["first_air_date"]).includes(first_air_date);
      } catch (e) {
        return true;
      }
    }).forEach(e => {
      resData = { ...resData,
        [e.original_name + "_" + e["first_air_date"]]: e
      };
    });
  }

  return resData;
};

exports.tmdbTvSearch = tmdbTvSearch;

const tmdbTvSearch2 = async (names, {
  releaseDate = null,
  page = 1,
  language = "en"
}) => {
  console.log({
    releaseDate,
    page,
    language
  });
  const ax = names.map(e => {
    return _axios.default.get(encodeURI(`${_constants.tmdbHost}/search/tv?${_constants.tmdbKeyQuery}&query=${e}&year=${releaseDate}&page=${page}&language=${language}`));
  });
  let resData = [];

  for (const res of ax) {
    (await res).data["results"].filter(e => {
      if (releaseDate == null) return true;

      try {
        return String(e["first_air_date"]).includes(releaseDate);
      } catch (e) {
        return true;
      }
    }).forEach(e => {
      resData = [...resData, e];
    });
  }

  return resData;
};

exports.tmdbTvSearch2 = tmdbTvSearch2;