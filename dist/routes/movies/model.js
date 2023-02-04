"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEgybestMovieDetails = exports.toMovieFromTmdb = exports.toMovieFromAkwam = exports.toMovieFromEgybest = exports.emptyVidoe = exports.emptyMovie = void 0;

var _uuid = require("uuid");

var _nodeHtmlParser = require("node-html-parser");

var _url = _interopRequireDefault(require("url"));

var _utils = require("../helpers/utils");

var _constants = require("../../utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {object} movie
 * @property {number} id
 * @property {string} egybestId
 * @property {number} tmdbId
 * @property {string} akwamId
 * @property {string} poster_path
 * @property {boolean} adult
 * @property {string} overview
 * @property {string} release_date
 * @property {number[]} genre_ids
 * @property {string} original_title
 * @property {string} original_language
 * @property {string} title
 * @property {string} backdrop_path
 * @property {number} popularity
 * @property {number} vote_count
 * @property {boolean} video
 * @property {number} vote_average
 * @property {string} ribon
 */
const emptyMovie = {
  id: 343611,
  egybestId: null,
  tmdbId: null,
  akwamId: null,
  adult: false,
  original_language: "en",
  poster_path: "",
  backdrop_path: null,
  original_title: null,
  title: null,
  overview: null,
  release_date: null,
  egybestWatchLink: null,
  vote_average: null,
  genre_ids: [],
  genres: [],
  videos: {},
  popularity: null,
  vote_count: null,
  video: false,
  ribon: null
};
exports.emptyMovie = emptyMovie;

const emptyVidoe = ({
  name = null,
  key = null,
  size = "1080"
}) => ({
  iso_639_1: "en",
  iso_3166_1: "US",
  name,
  key,
  site: "YouTube",
  size,
  type: "Trailer",
  official: true,
  published_at: "2014-10-02T19:20:22.000Z",
  id: (0, _uuid.v4)()
});
/**
 * @param {HTMLElement[]} data
 * @returns {movie}
 */


exports.emptyVidoe = emptyVidoe;

const toMovieFromEgybest = data => {
  const el = (0, _utils.getSingleObjectFromHtml)(data);
  return { ...emptyMovie,
    id: el.u,
    egybestId: el.u,
    title: el.title,
    original_title: String(el.title).replace(/\(.*/gm, "").trim(),
    poster_path: el.img,
    backdrop_path: el.img,
    link: _constants.HOST + "/movie/" + el.u,
    ribon: el.ribon,
    vote_average: el.rating,
    release_date: el.title.replace(")", "").split("(")[1]
  };
};
/**
 * @param {HTMLElement[]} data
 * @returns {movie}
 */


exports.toMovieFromEgybest = toMovieFromEgybest;

const toMovieFromAkwam = data => {
  return (0, _utils.getObjectFromHtml)(data).map(el => {
    return { ...emptyMovie,
      id: el.u,
      egybestId: el.u,
      title: el.title,
      original_title: el.title,
      poster_path: el.img,
      backdrop_path: el.img,
      ribon: el.ribon
    };
  });
};
/**
 * @param {movie[]} data
 * @returns {movie}
 */


exports.toMovieFromAkwam = toMovieFromAkwam;

const toMovieFromTmdb = data => {
  return data.map(json => {
    return { ...emptyMovie,
      ...json,
      id: json.id,
      tmdbId: json.id
    };
  });
};

exports.toMovieFromTmdb = toMovieFromTmdb;

const getEgybestMovieDetails = async (res, id) => {
  var _res$querySelectorAll, _res$querySelector, _res$querySelector2, _res$querySelectorAll2, _res$querySelectorAll3, _res$querySelector3;

  (_res$querySelectorAll = res.querySelectorAll(".mbox")[2].querySelectorAll("div.pda")[1].querySelector("strong")) === null || _res$querySelectorAll === void 0 ? void 0 : _res$querySelectorAll.remove();
  let data = {};
  res.querySelectorAll("table.movieTable.full > tr").forEach(e => {
    var _e$querySelector$text, _e$querySelector, _e$querySelector$text2;

    if (e.querySelector(".movie_title")) {
      data = { ...data,
        original_title: e.querySelector(".movie_title").text,
        title: e.querySelector(".movie_title").text,
        release_date: e.querySelector(".movie_title").text.replace(")", "").split("(")[1]
      };
    } else if (e.querySelector("td").text.includes("النوع")) {
      data = { ...data,
        genre_ids: e.querySelectorAll("td")[1].querySelectorAll("a").map(e => e.getAttribute("href")),
        genres: e.querySelectorAll("td")[1].querySelectorAll("a").map(e => ({
          id: e.getAttribute("href"),
          name: e.text
        }))
      };
    } else if ((_e$querySelector$text = (_e$querySelector = e.querySelector("td")) === null || _e$querySelector === void 0 ? void 0 : (_e$querySelector$text2 = _e$querySelector.text) === null || _e$querySelector$text2 === void 0 ? void 0 : _e$querySelector$text2.includes("التقييم")) !== null && _e$querySelector$text !== void 0 ? _e$querySelector$text : false) {
      var _e$querySelectorAll$, _e$querySelectorAll$2, _e$querySelectorAll$3;

      data = { ...data,
        vote_average: (_e$querySelectorAll$ = (_e$querySelectorAll$2 = e.querySelectorAll("td")[1]) === null || _e$querySelectorAll$2 === void 0 ? void 0 : (_e$querySelectorAll$3 = _e$querySelectorAll$2.querySelectorAll("span")[0]) === null || _e$querySelectorAll$3 === void 0 ? void 0 : _e$querySelectorAll$3.text) !== null && _e$querySelectorAll$ !== void 0 ? _e$querySelectorAll$ : null
      };
    } else {
      return undefined;
    }
  });
  return { ...emptyMovie,
    egybestWatchLink: _constants.HOST + (res === null || res === void 0 ? void 0 : (_res$querySelector = res.querySelector("div iframe")) === null || _res$querySelector === void 0 ? void 0 : _res$querySelector.getAttribute("src")),
    id: id,
    egybestId: id,
    poster_path: res.querySelector(".movie_img img").getAttribute("src"),
    backdrop_path: res.querySelector(".movie_img img").getAttribute("src"),
    overview: res.querySelectorAll(".mbox")[2].querySelectorAll("div.pda")[1].text.trim(),
    ...data,
    video: res.querySelector("#yt_trailer > div") ? true : false,
    videos: {
      results: res.querySelector("#yt_trailer > div") ? [emptyVidoe({
        key: _url.default.parse((_res$querySelector2 = res.querySelector("#yt_trailer > div")) === null || _res$querySelector2 === void 0 ? void 0 : _res$querySelector2.getAttribute("url")).pathname.split("/")[2],
        name: (_res$querySelectorAll2 = res.querySelectorAll(".mbox")[3]) === null || _res$querySelectorAll2 === void 0 ? void 0 : (_res$querySelectorAll3 = _res$querySelectorAll2.querySelector("div.pda.bdb.hd")) === null || _res$querySelectorAll3 === void 0 ? void 0 : _res$querySelectorAll3.text,
        size: (_res$querySelector3 = res.querySelector("#yt_trailer > div")) === null || _res$querySelector3 === void 0 ? void 0 : _res$querySelector3.getAttribute("size")
      })] : []
    }
  };
};

exports.getEgybestMovieDetails = getEgybestMovieDetails;