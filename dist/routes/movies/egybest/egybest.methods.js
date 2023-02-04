"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoviesFromEgybest = exports.MoviesTrendFromEgybest = exports.getEgybestVideoLinkFromId = exports.getEgybestMovieWithId = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _nodeHtmlParser = _interopRequireDefault(require("node-html-parser"));

var _ = require("../..");

var _constants = require("../../../utils/constants");

var _model = require("../../tvshows/model");

var _model2 = require("../model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getEgybestMovieWithId = async id => {
  let res = _axios.default.get(encodeURI(`${_constants.HOST}/movie/${id}?output_format=json`));

  console.log(`${_constants.HOST}/movie/${id}?output_format=json`);
  res = (0, _nodeHtmlParser.default)((await res).data["html"].replace("rn", "").replace("\\", ""));
  return (0, _model2.getEgybestMovieDetails)(res, id);
};
/**
 *
 * @param {HTMLElement} res
 * @returns
 */
// const getEgybestMovieWithName = async (req) => {
//   console.log("her 0");
//   let names = getNamesFromReq(req);
//   const releaseDate = req.query["releasedate"];
//   console.log({ releaseDate });
//   console.log("her -1");
//   const resData = Object.values(await egybestSearch(names, releaseDate));
//   console.log("her -2");
//   let { watch, linkProierity } = namesSearcher(names, resData);
// };


exports.getEgybestMovieWithId = getEgybestMovieWithId;

const getEgybestVideoLinkFromId = async ({
  id
}) => {
  const watchLink = await (0, _.getEgybestWatchLink)(_constants.HOST + "/movie/" + id);
  const videoLink = await (0, _.scrapEgybestWatchLink)(watchLink);
  return {
    watchLink,
    ...(videoLink.error ? videoLink : (0, _model.epFromVideoLink)(videoLink)),
    cors: true
  };
};

exports.getEgybestVideoLinkFromId = getEgybestVideoLinkFromId;

const MoviesTrendFromEgybest = async ({
  page,
  period = "week"
}) => {
  let {
    data
  } = await _axios.default.get(`${_constants.HOST}/trending/${period}?page=${page}`);
  data = (0, _nodeHtmlParser.default)(data).querySelectorAll("#movies > a.movie").map(e => (0, _model2.toMovieFromEgybest)(e));
  return {
    page,
    data
  };
};

exports.MoviesTrendFromEgybest = MoviesTrendFromEgybest;

const MoviesFromEgybest = async ({
  page,
  fillter = ""
}) => {
  let {
    data
  } = await _axios.default.get(`${_constants.HOST}/movies/${fillter}?page=${page}`);
  data = (0, _nodeHtmlParser.default)(data).querySelectorAll("#movies > a.movie").map(e => (0, _model2.toMovieFromEgybest)(e));
  return {
    page,
    data
  };
};

exports.MoviesFromEgybest = MoviesFromEgybest;