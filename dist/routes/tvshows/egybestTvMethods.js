"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTvSeasonEpsodsWatchLink = exports.getTvSeasonEpsods = exports.getTvShowSeasons = exports.tvshows = exports.getTvShow = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../../utils/constants");

var _utils = require("../helpers/utils");

var _nodeHtmlParser = require("node-html-parser");

var _cheerio = _interopRequireDefault(require("cheerio"));

var _ = require("..");

var _searchAlgorithm = require("../searchAlgorithm");

var _model = require("../movies/model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTvShow = async ({
  names = null,
  releaseData = null
}) => {
  const resData = await (0, _.egybestSearch)(names, releaseData, _constants.mediaType.tv);
  let {
    watch,
    linkProierity
  } = (0, _searchAlgorithm.namesSearcher)(names, Object.values(resData));
  return {
    watch,
    linkProierity
  };
};

exports.getTvShow = getTvShow;

const tvshows = async page => {
  let {
    data
  } = await _axios.default.get(`${_constants.HOST}/tv/popular?page=${page}`);
  data = (0, _utils.getObjectFromHtml2)((0, _nodeHtmlParser.parse)(data).querySelectorAll("#movies > a.movie"));
  return {
    page,
    data
  };
};

exports.tvshows = tvshows;

const getTvShowSeasons = async ({
  url = null,
  name = null
}) => {
  const {
    data
  } = await _axios.default.get(url !== null && url !== void 0 ? url : `${_constants.HOST}/series/${name}`);
  const result = (0, _utils.getObjectFromHtml)((0, _cheerio.default)("div .mbox .movies_small", data).first().children("*")).reverse();
  return result;
};

exports.getTvShowSeasons = getTvShowSeasons;

const getTvSeasonEpsods = async ({
  url = null,
  name = null
}) => {
  const {
    data
  } = await _axios.default.get(url !== null && url !== void 0 ? url : `${_constants.HOST}/season/${name}`);
  const result = (0, _utils.getObjectFromHtml)((0, _cheerio.default)("div .mbox .movies_small", data).first().children("*")).reverse();
  return result;
};

exports.getTvSeasonEpsods = getTvSeasonEpsods;

const getTvSeasonEpsodsWatchLink = async ({
  url = null,
  name = null
}) => {
  const {
    data
  } = await _axios.default.get((url !== null && url !== void 0 ? url : `${_constants.HOST}/episode/${name}`) + "/?output_format=json");
  const href = (0, _cheerio.default)("div iframe", data.html).attr("src");
  const watch = _constants.HOST + href;
  return {
    watch
  };
};

exports.getTvSeasonEpsodsWatchLink = getTvSeasonEpsodsWatchLink;